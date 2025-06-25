<?php

namespace App\Http\Controllers;

use App\Models\Ads;
use App\Models\Post;
use App\Models\Setting;
use Illuminate\Http\Request;
use App\Models\User;

class HomeController extends Controller
{
   public function latestMembers()
    {
        $users = User::latest()->take(4)->get();

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    public function latestPosts()
    {
        // Get all top-level posts (not comments)
        $posts = Post::with('user')
                    ->withCount('comments')
                    ->whereNull('parent_id')
                    ->latest()
                    ->take(3)
                    ->get();
            

        return response()->json([
            'success' => true,
            'data' => $posts
        ]);
    }

    public function allAds()
    {
        $ads = Ads::get();
            
        return response()->json([
            'success' => true,
            'data' => $ads
        ]);
    }

    public function AllMembers()
    {
        $users = User::latest()->get();

        return response()->json([
            'success' => true,
            'users' => $users
        ]);
    }

    public function AllHome()
    {
        $users = User::latest()->get();
        $ads = Ads::get();
        $posts = Post::with('user')
                    ->withCount('comments')
                    ->whereNull('parent_id')
                    ->latest()
                    ->take(3)
                    ->get();
         $users = User::latest()->take(4)->get();
         $setting = Setting::first();

        return response()->json([
            'success' => true,
            'users' => $users,
            'posts' => $posts,
            'ads' =>$ads,
            'setting' =>$setting,
        ]);
    }

}
