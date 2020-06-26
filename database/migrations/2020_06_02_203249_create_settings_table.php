<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->uuid('game_id')->unique();
            $table->string('banned_person')->nullable();
            $table->string('kicked_person')->nullable();
            $table->string('user_roles');
            $table->time('duration', 0);
            $table->string('game_type');
            $table->string('invite_url')->unique();
            $table->integer('group_size');
            $table->string('questions');
            $table->boolean('joinable');
            $table->string('music');
            $table->string('soundsfx');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('settings');
    }
}
