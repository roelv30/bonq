<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuestionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('question', function (Blueprint $table) {
            $table->uuid('id')->unique();
            $table->integer('order');   // displays where the question should be put in order e.g. 1 will be the first question
            $table->string('question');
            $table->string('good_answer');
            $table->string('wrong_answer');
            $table->string('answer');
            $table->string('img_url');
            $table->time('time', 0);
            $table->time('time_left', 0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('question');
    }
}
