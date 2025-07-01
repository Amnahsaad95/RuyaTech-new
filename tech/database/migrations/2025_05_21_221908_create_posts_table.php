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
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title')->nullable();
            $table->longText('content');
            $table->string('image_path')->nullable();
            $table->foreignId('parent_id')->nullable()->references('id')->on('posts')->onDelete('cascade');
            $table->enum('status', ['draft', 'published', 'unpublished', 'rejected','pending'])->nullable();
            			
			$table->integer('like');		
			$table->integer('hit');		
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
