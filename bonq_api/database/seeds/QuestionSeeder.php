<?php

use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('question')->insert([

        ]);
    }

    // $table->integer('id')->unique();
    // $table->integer('order');   // displays where the question should be put in order e.g. 1 will be the first question
    // $table->string('question');
    // $table->string('good_answer');
    // $table->string('wrong_answer');
    // $table->string('answer');
    // $table->string('img_url');
    // $table->time('time', 0);
    // $table->time('time_left', 0);
}
