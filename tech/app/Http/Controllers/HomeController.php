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

    public function getStats()
    {
        // Total counts
        $totalUsers = User::count();
        $totalStudents = User::where('role', 'student')->count();
        $totalCompanies = User::where('role', 'company')->count();
        $totalProfessionals = User::where('role', 'professional')->count();
        $totalPosts = Post::where('status', 'published')->count();
        
        // Get total jobs from company hiring needs
        $totalJobs = User::where('role', 'company')
            ->get()
            ->reduce(function ($carry, $user) {
                $hiringNeeds = $user->bio['hiring_needs'] ?? null;
                if ($hiringNeeds && isset($hiringNeeds['open_positions'])) {
                    return $carry + count($hiringNeeds['open_positions']);
                }
                return $carry;
            }, 0);
        
        return response()->json([
            'totalUsers' => $totalUsers,
            'totalStudents' => $totalStudents,
            'totalCompanies' => $totalCompanies,
            'totalProfessionals' => $totalProfessionals,
            'totalPosts' => $totalPosts,
            'totalJobs' => $totalJobs,
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->input('q');
       // return response()->json($query);

        if (!$query || strlen($query) < 3) {
            return response()->json(['users' => [], 'posts' => []]);
        }

        $users = User::where('name', 'like', "%$query%")
            ->orWhere('email', 'like', "%$query%")
            ->limit(10)
            ->get();
       // return response()->json($users);
        $posts = Post::where('title', 'like', "%$query%")
            ->orWhere('content', 'like', "%$query%")
            ->with('user')
            ->limit(10)
            ->get();
       // return response()->json($posts);
        return response()->json([
            'users' => $users,
            'posts' => $posts,
        ]);
    }

}
