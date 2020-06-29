<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $table = "question";

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'rounds_array' => 'array',
    ];

    public function answer(){

            return $this->hasMany(Answer::class, 'answer_id', 'question_id');
    }

}
