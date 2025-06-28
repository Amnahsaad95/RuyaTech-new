<?php

use App\Http\Controllers\API\AdsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\API\PostController;
use App\Http\Controllers\API\ReactionController;
use App\Http\Controllers\API\ProfileController;
use App\Http\Controllers\HomeController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
//  routes for home Pages
Route::get('/latest-members', [HomeController::class, 'latestMembers']);
Route::get('/latest-posts', [HomeController::class, 'latestPosts']);
Route::get('/all-ads', [HomeController::class, 'allAds']);
Route::get('/all-members', [HomeController::class, 'AllMembers']);
Route::get('/all', [HomeController::class, 'AllHome']);
Route::get('/home/stats', [HomeController::class, 'getStats']);
Route::get('/search', [HomeController::class, 'search']);
Route::get('/settings', [ProfileController::class, 'showSetting']);

// Public routes for Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'sendResetLink']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);



// Public post routes (accessible without authentication)
Route::get('/posts', [PostController::class, 'index']); // Get all posts
Route::get('/posts/{post}', [PostController::class, 'show']); // Get single post
Route::get('/posts/{post}/comments', [PostController::class, 'getComments']); // Get post comments
Route::get('/members/{id}', [ProfileController::class, 'getUserProfile']);


// public ads route
Route::post('/ads', [AdsController::class, 'store']);
Route::get('/ads', [AdsController::class, 'index']); // Get all posts

Route::get('/users/search', [ProfileController::class, 'search']);



// Protected routes
Route::middleware('auth:sanctum')->group(function () {

    //  routes for Auth for Update and logout
    Route::post('/users/{id}', [AuthController::class, 'update']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Protected post routes for create ,update and delete
    Route::post('/posts', [PostController::class, 'store']);
    Route::post('/posts/{id}', [PostController::class, 'update']);
    Route::delete('/posts/{id}', [PostController::class, 'destroy']);


    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Ads routes for update and delete
    Route::put('/ads/{ad}', [AdsController::class, 'update']);
    Route::delete('/ads/{id}', [AdsController::class, 'destroy']);

    // profile routes for show and delete
    Route::get('/profile', [ProfileController::class, 'show']);    
    Route::post('/profile/{id}', [ProfileController::class, 'update']);    
    Route::delete('/profile/{id}', [ProfileController::class, 'destroy']);

    //site setting
    Route::post('/settings', [ProfileController::class, 'updateSetting']);

    // Dashboard 
    Route::get('/dashboard/stats', [DashboardController::class, 'getStats']);
    
});
