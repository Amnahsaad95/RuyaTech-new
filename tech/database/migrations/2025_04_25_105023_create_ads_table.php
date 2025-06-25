<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ads', function (Blueprint $table) {
            $table->id();			
			$table->string('FullName');							  
			$table->string('Image')->nullable();			
			$table->integer('hit');							  
			$table->string('ad_Url');					  
			$table->string('location');
            $table->timestamp('start_date')->nullable();
			$table->timestamp('End_date')->nullable();
			$table->enum('status', ['pending', 'published','unpublished', 'rejected'])->default('pending');
			$table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ads');
    }
};
