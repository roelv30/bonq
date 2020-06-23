<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Question;
use App\Answer;

class AnswerController extends Controller
{
    public function getQuestion(){
      
      $questions = Question::with(['Answer'])->get();

      return response()->json($questions);
    }
}
