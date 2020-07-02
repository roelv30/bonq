<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });


Route::post('/signup', 'FrontEndUserController@signUp');
Route::post('/signin', 'FrontEndUserController@signIn');
Route::get('/refreshToken', 'FrontEndUserController@refreshToken');

Route::get('/question', 'AnswerController@getQuestion');

Route::get('/getRooms', 'PubQuestionController@show');

Route::get('/getQuestions/{room}', 'PubQuestionController@getData');

Route::get('/score', 'FrontEndUserController@getScore');

Route::group(['middleware' => 'jwt.auth'], function() {
    Route::get('/dashboard', 'FrontEndUserController@showDashboard');
    Route::get('/avatar', 'FrontEndUserController@avatarGet');
    Route::post('/avatar', 'FrontEndUserController@avatarSubmit');
    Route::post('/parsePubQnA', 'PubQuestionController@store');
});
