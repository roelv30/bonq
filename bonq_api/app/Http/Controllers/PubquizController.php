<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;

class PubquizController extends Controller
{
  public function parsePubQnA(Request $request){
    //try catch statement to prevent stuff like empty rounds or something

    return response()->json(['round1' => $request->round1, 'round2' => $request->round2]);
  }
}
