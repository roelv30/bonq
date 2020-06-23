<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLobbyTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lobby', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('game_host');
            $table->string('lobby_key');
            $table->string('team_id');
            $table->foreign('team_id')->references('lobby_id')->on('teams')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('lobby');
    }
}
