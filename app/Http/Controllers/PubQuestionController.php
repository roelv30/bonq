<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PubQuestionController extends Controller
{
  public function store(Request $request){
    // return $request;
    $bier = new Bier();
    $bier->naam = $request->input('naam');
    $bier->merk = $request->input('merk');
    $bier->alcoholpercentage = $request->input('alcoholpercentage');
    $bier->bitterheid_EBU = $request->input('bitterheid_EBU');
    $bier->biersoort = $request->input('biersoort');

    // $image = $request->input('image');
    // $bier->image = "img/" . $image;

    if ($request->hasfile('image')) {
      $file = $request->file('image');
      $extension = $file->getClientOriginalExtension();
      $filename = time() . '.' . $extension;
      $file->move('img/biertjes/', $filename);
      $bier->image = $filename;
    }
    // else {
    //   $bier->image = '';
    // }

    try {
      $bier->save();
      return redirect('/bier');
    } catch (\Exception $e) {
      return redirect('/bier/create');
    }


  }
}
