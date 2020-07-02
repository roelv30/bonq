<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Score extends Model
{
    protected $table = 'score';
    protected $fillable = ['team', 'score'];
    public $timestamps = false;
}
