<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $table = "question";

    public function answer(){

            return $this->hasMany(Answer::class, 'answer_id', 'question_id');
    }
}
