<?php

namespace Database\Factories;

use App\Models\Folder;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Folder>
 */
class FolderFactory extends Factory
{
    protected $model = Folder::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'fecha_ingreso'=> $this->faker->date(),
            'tramite'=> $this->faker->sentence(),
            'nombre_propietario'=> $this->faker->sentence(),
            'ficha'=> $this->faker->numberBetween(500,900),
            'cedula'=> $this->faker->sentence(),
            'nombre_quiendeja'=> $this->faker->sentence(),
            'estado_carpeta'=> $this->faker->numberBetween(1, 9),
            'nombre_quienretira'=> $this->faker->sentence(),
            'fecha_retiro'=> $this->faker->date(),
            'numero_ingreso'=> $this->faker->numberBetween(1, 5),
        ];
    }
}
