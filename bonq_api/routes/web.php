<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/person', 'ApiController@show');
Route::get('/teams/{lobby_id}', 'ApiController@getGameHost');

Route::get('/api/projects', 'ApiController@test');

Route::get('/api/roomid', 'ApiController@getUuid');

Route::resource('role', 'RoleController');
// Route::post('/role/create', 'RoleController@create')->middleware('Auth');

Route::get('/host', 'ApiController@getHost')->middleware('checkHost');

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
