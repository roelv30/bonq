<?php

use Illuminate\Database\Seeder;

class LobbySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('lobby')->insert([
          'id'=>'hoi ik ben een id',
          'game_host' => 'Roel',
          'lobby_key'=> '275fdd39-9210-45dc-ab84-20fde34cf627',
          'team_id'=>'kill'
        ]);
    }

    // $table->integer('id');
    // $table->string('game_host');
    // $table->uuid('unique_id');
    // $table->string('groups');
}
