<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAvatarsToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('avatar_url')->default('/img/avatars/18.svg');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      if (Schema::hasColumn('users', 'avatar_url')){

        Schema::table('users', function (Blueprint $table){
            $table->dropColumn('avatar_url');
        });

      }
    }
}
