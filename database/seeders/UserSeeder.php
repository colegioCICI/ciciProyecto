<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;


class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user1 = User::create([
            'name' => 'Presidente CICI',
            'email' => 'presidente@gmail.com',
            'password' => bcrypt('123456789')
        ]);

        $user2 = User::create([
            'name' => 'Secretaria CICI',
            'email' => 'secretaria@gmail.com',
            'password' => bcrypt('123456789')
        ]);

        $user3 = User::create([
            'name' => 'Ingeniero Revisor CICI',
            'email' => 'revisor@gmail.com',
            'password' => bcrypt('123456789')
        ]);

        $user4 = User::create([
            'name' => 'Soporte Técnico',
            'email' => 'juan@gmail.com',
            'password' => bcrypt('123456789')
        ]);
    
        // $user5 = User::create([
        //     'name' => 'Normal',
        //     'email' => 'normal@gmail.com',
        //     'password' => bcrypt('123456789')
        // ]);

        // Asigna el rol 'ingPresidente' al usuario recién creado
        $user1->syncRoles(['ingPresidente']);

        // Asigna el rol 'secretaria' al usuario recién creado
        $user2->syncRoles(['secretaria']);

        // Asigna el rol 'ingRevisor' al usuario recién creado
        $user3->syncRoles(['ingRevisor']);

        //
        $user4->syncRoles(['developer']);

        //
        // $user5->syncRoles(['normal']);
    }
}
