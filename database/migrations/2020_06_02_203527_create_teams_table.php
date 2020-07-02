<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTeamsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('teams', function (Blueprint $table) {
            $table->string('lobby_id')->primary();
            $table->string('game_host');
            $table->string('unique_id');
            $table->string('person_id');
            $table->integer('group_size');
            $table->string('team_name');
            $table->integer('score');
            $table->string('winner')->nullable();
            $table->string('pun_id');   // jokes to show to the player while they are waiting
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('teams');
    }
}
