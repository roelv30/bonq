<?php

use Illuminate\Database\Seeder;

class PersonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      DB::table('person')->insert([

      ]);
    }

    // $table->integer('id');
    // $table->string('name');
    // $table->string('nickname');
    // $table->string('avatar');
    // $table->string('phone_number');
    // $table->string('email')->unique();
    // $table->integer('level');
    // $table->integer('bonq_coins');
    // $table->string('status');
    // $table->string('password');         // haha password go stringggg
    // $table->string('default_language');
    // $table->date('last_login');
}
