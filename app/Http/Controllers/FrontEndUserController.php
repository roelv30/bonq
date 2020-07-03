<?php

namespace App\Http\Controllers;
use DB;
use Auth;
use JWTAuth;
use App\User;
use App\Teams;
use App\Score;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;


class FrontEndUserController extends Controller
{

  public function testIndex() {
    return Teams::all();
  }

    public function getScore() {
        return Score::all();
    }

    public function truncateScore(){
      Score::query()->truncate();
    }

    public function setScore(Request $request) {
        $score = Score::create(['team' => $request->team, 'score' => $request->score]);
        try {
            $score->save();
        }catch (\Exception $e) {
            return $e;
        }

    }


  public function signUp(Request $request) {
    $user = User::create(['username' => $request->username, 'email' => $request ->email,'password'=>bcrypt($request->password)]);
  }

    public function showDashboard() {
        $user = Auth::user();
        return $user;
    }

  public function signIn(Request $request)
  {
    try {
      if (! $token = JWTAuth::attempt(['email' => $request->email, 'password' => $request->password])) {
        return response()->json(['error' => 'invalid_credentials'], 401);
      }
    } catch (JWTException $e) {
      return response()->json(['error' => 'could_not_create_token'], 500);
    }

    return response()->json(compact('token'));
  }

  public function refreshToken()
  {
    $token = JWTAuth::getToken();

    try {
        $token = JWTAuth::refresh($token);
    } catch (JWTException $e) {
        return response()->json(['error' => 'could_not_create_token'], 500);
    }

    return response()->json(compact('token'));
}

    public function avatarSubmit(Request $request){
        try {
            $user = Auth::user();
            $userAvatar = $request->avatar_url;
            $userID = $user->id;
            DB::update('update users set avatar_url = ? where id = ?',[$userAvatar, $userID]);
            return $userAvatar;
        } catch (Exception $e) {
            return $e;
        }

    }

    public function avatarGet(){
        $user = Auth::user();
        $userAvatar = $user->avatar_url;

        return $userAvatar;
    }

}
