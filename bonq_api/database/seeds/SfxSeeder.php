<?php

use Illuminate\Database\Seeder;

class SfxSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      DB::table('sfx')->insert([

      ]);
    }

    // $table->integer('id')->unique();
    // $table->string('type');
    // $table->string('location');
}
