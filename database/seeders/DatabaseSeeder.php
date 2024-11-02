<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $this->call(FolderSeeder::class);
        $this->call(NotificationSeeder::class);
        $this->call(DocumentSeeder::class);
        $this->call(ReviewSeeder::class);
        $this->call(ObservationSeeder::class);
        $this->call(CorrectionSeeder::class);
        $this->call(RoleSeeder::class);
        $this->call(UserSeeder::class);
        
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}
