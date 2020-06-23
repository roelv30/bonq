<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Answer;
use App\Question;

class Question extends Model
{
    protected $table = 'question';

    public function answer(){

        return $this->hasMany(Answer::class, 'answer_id', 'question_id');
    }
}
