<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use App\Question;
use App\Answer;

class PubQuestionController extends Controller
{
  public function store(Request $request){
    // return $request;
    // $answer = new Answer();
    // $answer->checked_answer = $request->state->round0;

    // $bier->merk = $request->input('merk');
    // $bier->alcoholpercentage = $request->input('alcoholpercentage');
    // $bier->bitterheid_EBU = $request->input('bitterheid_EBU');
    // $bier->biersoort = $request->input('biersoort');

    // try {
    //   $bier->save();
    //   return redirect('/bier');
    // } catch (\Exception $e) {
    //   return redirect('/bier/create');
    // }

    // $data = $request->state;
    //
    // $area = json_decode($data, true);
    // $ananas = json_decode($request);


    // $request->merge($temp);

    // $data = $request->state->map(function($item, $key){
    //   return $item;
    // });

    // $temp = ["hahaha", "wat leuk"];
    // $pcikup->rounds_array = $temp;

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
}
