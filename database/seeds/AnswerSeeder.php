<?php

use Illuminate\Database\Seeder;

class AnswerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      DB::table('answer')->insert([
        'answer_id' => 1,
        'checked_answer' => '13'
      ]);

      DB::table('answer')->insert([
        'answer_id' => 2,
        'checked_answer' => 'Ra'
      ]);
    }
}
