<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStatsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stats', function (Blueprint $table) {
            $table->integer('games_hosted');
            $table->integer('games_played');
            $table->integer('games_won');
            $table->integer('games_lost');
            $table->integer('win_streak');
            $table->uuid('person_id')->unique();
            $table->string('favorite_game');  // game that is played the most for a user
            $table->date('date_joined');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('stats');
    }
}
