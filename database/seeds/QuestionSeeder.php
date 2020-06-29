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
              // 'question_id' => 1,
              'room_id' => "Frankenstein",
              'rounds_array' => "[]",
              // 'order' => 1,
              // 'shown_question' => 'how many playable classes exist in Dungeons and Dragons?',
              // 'answer' => 1,
              'img_url' => 'https://i.redd.it/d5gjwfbvrkb41.png'
            ]);

            DB::table('question')->insert([
              // 'question_id' => 2,
              'room_id' => "117013",
              'rounds_array' => "[]",
              // 'order' => 2,
              // 'shown_question' => 'who is the egyptian god of the sun?',
              // 'answer' => 2,
              'img_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Re-Horakhty.svg/266px-Re-Horakhty.svg.png'
            ]);
            // $pickup = App\Pickup::create([
            //     'default' => true,
            //     'shifts' => '[1, 5, 7]', // you can easily assign an actual integer array here
            //     'status_id' => 1
            // ]);
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
