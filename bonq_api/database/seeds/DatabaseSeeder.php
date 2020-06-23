<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // $this->call(UserSeeder::class);
        $this->call(BackgroundMusicSeeder::class);
        $this->call(GameStatsSeeder::class);
        $this->call(TeamsSeeder::class);
        $this->call(LobbySeeder::class);
        $this->call(PersonSeeder::class);
        $this->call(AnswerSeeder::class);
        $this->call(QuestionSeeder::class);
        $this->call(SettingsSeeder::class);
        $this->call(SfxSeeder::class);
        $this->call(StatsSeeder::class);
        $this->call(RolesTableSeeder::class);
    }
}
