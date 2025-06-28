<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Seeders\UserSeeder ;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(UsersSeeder::class);
        $this->call(PostSeeder::class);
        $this->call([
			SettingSeeder::class,
		]);
        $this->call(AdsSeeder::class);
    }
}
