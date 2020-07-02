<?php

use Illuminate\Database\Seeder;

class TeamsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('teams')->insert([
          'lobby_id' => 'kill',
          'game_host' => 'Roel',
          'unique_id'=> '0c195e0f-fbd9-40b4-b70e-2ca4f2f1bfbb',
          'person_id'=> '46b9c1ba-81a2-4d4e-9504-83569f63277f',
          'group_size' => 4,
          'team_name' => 'bonq_team',
          'score' => 10,
          'winner' => null,
          'pun_id'=> '2ab71f0a-959b-436b-8123-0e373b5c01db'
        ]);

        DB::table('teams')->insert([
          'lobby_id' => 'yoink',
          'game_host' => 'Kim',
          'unique_id'=> '0c195e0f-fbd9-40b4-b70e-2ca4f2f1bfbb',
          'person_id'=> '46b9c1ba-81a2-4d4e-9504-83569f63277f',
          'team_name' => 'bonqerboys',
          'group_size' => 4,
          'score' => 0,
          'winner' => null,
          'pun_id'=> '2ab71f0a-959b-436b-8123-0e373b5c01db'
        ]);
    }

    // $table->integer('lobby_id')->unique();
    // $table->string('game_host');
    // $table->uuid('unique_id');
    // $table->string('person');
    // $table->integer('group_size');
    // $table->string('winner');
    // $table->string('bad_puns');
}
