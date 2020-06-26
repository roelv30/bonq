<?php

use Illuminate\Database\Seeder;

class GameStatsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      DB::table('game_stats')->insert([

      ]);
    }

    // $table->integer('id')->unique();
    // $table->string('joined_nicknames');
    // $table->string('person');
    // $table->integer('group_size');
    // $table->string('invite_url');
    // $table->string('game');
    // $table->string('winner');
    // $table->time('closed_on', 0);
    // $table->string('status');
}
