<?php

namespace App\Http\Controllers;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use DB;
use App\Person;
use App\Lobby;
use App\Teams;
use App\User;
use App\Role;

class ApiController extends Controller
{
    public function show(){
      return Person::all();
    }

    public function getGameHost($lobby_id){
      return DB::table('teams')->where('lobby_id','=',$lobby_id)->get();
    }

    public function getHost(){
      return view('role.create');
    }

    public function getUuid(){
    return response()->json([
                'uuid' =>  (string) Str::uuid()
            ]);
    }


    public function test(){
        return response()->json([
            'status' => 'Operational'
        ]);
    }
}
