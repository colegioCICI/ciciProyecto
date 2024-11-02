<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notificación de Actualización de Carpeta</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            background-color: #00a72a;
            color: #ffffff;
            padding: 10px 0;
            border-bottom: 4px solid #006b17;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
        }
        .content p {
            margin-bottom: 15px;
        }
        .footer {
            text-align: center;
            padding: 10px 0;
            font-size: 12px;
            color: #777;
        }
        .button {
            display: inline-block;
            padding: 10px 15px;
            background-color: #28a745;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .button:hover {
            background-color: #218838;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Notificación de Actualización de Carpeta</h1>
        </div>
        <div class="content">
            <p>Estimado(a) <strong>{{ $detalles['nombre_propietario'] }}</strong>,</p>
            <p>Le informamos que la información de su trámite con referencia <strong>{{ $detalles['tramite'] }}</strong> ha sido actualizada.</p>
            <p><em>"{{ $detalles['mensaje'] }}"</em></p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Colegio de Ingenieros Civiles de Imbabura.</p>
        </div>
    </div>
</body>
</html>
