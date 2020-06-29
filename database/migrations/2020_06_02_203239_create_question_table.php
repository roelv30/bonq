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
            $table->integer('question_id')->primary();
            $table->string('room_id');
            $table->integer('round');
            $table->integer('order');   // displays where the question should be put in order e.g. 1 will be the first question
            $table->string('shown_question');
            $table->integer('answer');
            $table->foreign('answer')->references('answer_id')->on('answer');
            $table->string('img_url');
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
        $table->dropForeign('question_answer_id_foreign');
    }
}
