<?php

namespace App\Services;

use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;
use PhpAmqpLib\Channel\AMQPChannel;
use Illuminate\Support\Facades\Log;

class RabbitMQService
{
    private $connection;
    private $channel;
    private $connected = false;
    private $shouldStop = false;
    private $mode; // 'producer' o 'consumer'

    public function __construct(string $mode = 'producer')
    {
        $this->mode = $mode;
        $this->connect();
    }

    private function connect(): void
    {
        try {
            $config = config('rabbitmq');
            
            $this->connection = new AMQPStreamConnection(
                $config['host'],
                $config['port'],
                $config['user'],
                $config['password'],
                $config['vhost']
            );
            
            $this->channel = $this->connection->channel();
            
            // Declarar exchange (común para producer y consumer)
            $this->channel->exchange_declare(
                'innovaepp_events', 
                'topic', 
                false, 
                true,  // durable
                false
            );
            
            // Solo el consumer declara queue y bindings
            if ($this->mode === 'consumer') {
                $this->channel->queue_declare(
                    'innova_notifications',
                    false,
                    true,  // durable
                    false,
                    false
                );
                
                // Bind para escuchar todos los eventos de CAEI y CICI
                $this->channel->queue_bind('innova_notifications', 'innovaepp_events', 'caei.*');
                $this->channel->queue_bind('innova_notifications', 'innovaepp_events', 'cici.*');
            }
            
            $this->connected = true;
            
            Log::info("✅ RabbitMQ conectado como {$this->mode}", [
                'host' => $config['host'],
                'mode' => $this->mode
            ]);
            
        } catch (\Exception $e) {
            Log::error("❌ Error conectando a RabbitMQ", [
                'error' => $e->getMessage(),
                'host' => config('rabbitmq.host'),
                'mode' => $this->mode
            ]);
            $this->connected = false;
            throw $e;
        }
    }

    /**
     * PUBLICAR EVENTOS (para CAEI y CICI)
     */
    public function publish(string $exchange, string $routingKey, array $message): void
    {
        if (!$this->connected) {
            throw new \Exception("RabbitMQ no está conectado");
        }

        try {
            $msg = new AMQPMessage(
                json_encode($message),
                ['delivery_mode' => AMQPMessage::DELIVERY_MODE_PERSISTENT]
            );

            $this->channel->basic_publish($msg, $exchange, $routingKey);
            
            Log::info("📤 Evento publicado", [
                'exchange' => $exchange,
                'routing_key' => $routingKey,
                'event' => $message['event'] ?? 'unknown',
                'sistema' => $message['sistema_origen'] ?? 'unknown'
            ]);
            
        } catch (\Exception $e) {
            Log::error("❌ Error publicando evento", [
                'error' => $e->getMessage(),
                'exchange' => $exchange,
                'routing_key' => $routingKey
            ]);
            throw $e;
        }
    }

    /**
     * CONSUMIR EVENTOS (solo para INNOVA)
     */
    public function consume(string $queue, callable $callback): void
    {
        if (!$this->connected || $this->mode !== 'consumer') {
            throw new \Exception("RabbitMQ no está configurado como consumer");
        }

        try {
            Log::info("🎯 Iniciando consumer", [
                'queue' => $queue
            ]);

            // Configurar el consumer
            $this->channel->basic_consume(
                $queue,
                '',    // consumer tag
                false, // no local
                false, // no ack (MANUAL acknowledgment)
                false, // exclusive
                false, // no wait
                function (AMQPMessage $msg) use ($callback) {
                    try {
                        Log::debug("📥 Mensaje recibido", [
                            'body' => $msg->body
                        ]);

                        // Ejecutar callback con el mensaje completo
                        $callback($msg);
                        
                        // ✅ COMPATIBLE: Ack del mensaje
                        $msg->delivery_info['channel']->basic_ack($msg->delivery_info['delivery_tag']);
                        
                        Log::debug("✅ Mensaje procesado y confirmado");
                        
                    } catch (\Exception $e) {
                        Log::error("❌ Error procesando mensaje", [
                            'error' => $e->getMessage(),
                            'message_body' => $msg->body
                        ]);
                        
                        // ✅ COMPATIBLE: Rechazar mensaje (no reintentar)
                        $msg->delivery_info['channel']->basic_reject($msg->delivery_info['delivery_tag'], false);
                    }
                }
            );

            Log::info("⏳ Esperando eventos... (Ctrl+C para detener)");

            // ✅ COMPATIBLE: Mantener el consumer corriendo
            while (count($this->channel->callbacks)) {
                if ($this->shouldStop) {
                    Log::info("🛑 Deteniendo consumer...");
                    break;
                }
                
                $this->channel->wait(null, false, 1); // Timeout de 1 segundo
            }

        } catch (\Exception $e) {
            Log::error("❌ Error en consumer", [
                'error' => $e->getMessage(),
                'queue' => $queue
            ]);
            $this->connected = false;
            throw $e;
        }
    }

    public function stop(): void
    {
        $this->shouldStop = true;
    }

    public function __destruct()
    {
        try {
            if (isset($this->channel)) {
                try {
                    $this->channel->close();
                    Log::debug("🔒 Canal RabbitMQ cerrado");
                } catch (\Exception $e) {
                    // Ignorar errores al cerrar canal
                }
            }
            if (isset($this->connection)) {
                try {
                    $this->connection->close();
                    Log::debug("🔒 Conexión RabbitMQ cerrada");
                } catch (\Exception $e) {
                    // Ignorar errores al cerrar conexión
                }
            }
        } catch (\Exception $e) {
            Log::warning("⚠️ Error en destructor RabbitMQ: " . $e->getMessage());
        }
    }

    public function isConnected(): bool
    {
        return $this->connected;
    }
}