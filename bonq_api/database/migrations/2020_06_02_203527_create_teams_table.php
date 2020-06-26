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
            $table->string('winner')->nullable();
            $table->integer('team_answer');
            $table->foreign('team_answer')->references('team_answer_id')->on('team_answer');
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
