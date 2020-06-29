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

    return $request->state->round0;
  }

  public function show(){

    // $pickup = Question::create([
    //     'room_id' => true,
    //     'rounds_array' => '[1, 5, 7]', // you can easily assign an actual integer array here
    //     'img_url' => 1
    // ]);

    $pcikup = Question::first();
    // dump($pcikup);

    $temp = ["hahaha", "wat kut"];
    // $temp[] = $pcikup->rounds_array->toArray();
    $pcikup->rounds_array = $temp;
    // // $myTable.my_field[] = $temp;
    // dump($temp);

    return $temp;
  }
}
