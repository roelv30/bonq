<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePersonTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('person', function (Blueprint $table) {
            $table->uuid('id');
            $table->string('name');
            $table->string('nickname');
            $table->string('avatar');
            $table->string('phone_number');
            $table->string('email')->unique();
            $table->integer('level');
            $table->integer('bonq_coins');
            $table->string('status');
            $table->string('password');         // haha password go stringggg
            $table->string('default_language');
            $table->date('last_login');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('person');
    }
}
