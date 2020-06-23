<?php

use Illuminate\Database\Seeder;

class StatsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('stats')->insert([
          
        ]);
    }

    // $table->integer('games_hosted');
    // $table->integer('games_played');
    // $table->integer('games_won');
    // $table->integer('games_lost');
    // $table->integer('win_streak');
    // $table->integer('person_id')->unique();
    // $table->string('favorite_game');  // game that is played the most for a user
    // $table->date('date_joined');
}
