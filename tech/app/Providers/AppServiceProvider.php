<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Post;
use App\Policies\PostPolicy;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */

   protected $policies = [
        Post::class => PostPolicy::class,
    ];

    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
         //
    }
}
