<?php

use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('settings')->insert([
          
        ]);
    }

    // $table->integer('game_id')->unique();
    // $table->string('banned_person');
    // $table->string('kicked_person');
    // $table->string('user_roles');
    // $table->time('duration', 0);
    // $table->string('game_type');
    // $table->string('invite_url')->unique();
    // $table->integer('group_size');
    // $table->string('questions');
    // $table->boolean('joinable');
    // $table->string('music');
    // $table->string('soundsfx');
}
