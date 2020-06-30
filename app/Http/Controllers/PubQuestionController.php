<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use App\Question;
use App\Answer;

class PubQuestionController extends Controller
{
  public function store(Request $request){

    $dummyImgUrl = "/no/limits";

    $item = new Question();
    $item->rounds_array = $request->rounds;
    $item->room_id = $request->room;
    $item->img_url = $dummyImgUrl;

    try {
      $item->save();
      return true;
    } catch (\Exception $e) {
      return $e;
    }
  }

  public function show(){

    $rooms = Question::select('room_id')->get();

    return response()->json($rooms);
  }

  public function getData($room){

    return Question::where('room_id','=',$room)->get();
  }
}
