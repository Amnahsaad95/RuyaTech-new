<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Post;
use App\Models\Ads;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function getStats()
    {
        // Total counts
        $totalUsers = User::count();
        $totalStudents = User::where('role', 'student')->count();
        $totalCompanies = User::where('role', 'company')->count();
        $totalProfessionals = User::where('role', 'professional')->count();
        $totalPosts = Post::where('status', 'published')->count();
        $totalJobs = Post::where('status', 'published')->where('parent_id', null)->count(); // Assuming jobs are top-level posts
        $activeAds = Ads::where('status', 'published')
                      ->where('start_date', '<=', now())
                      ->where('end_date', '>=', now())
                      ->count();
        $pendingApprovals = User::where('status', 'pending')->count();

        // Growth calculations (month over month)
        $lastMonth = Carbon::now()->subMonth();
        
        $previousUsers = User::where('created_at', '<', $lastMonth)->count();
        $currentUsers = $totalUsers - $previousUsers;
        $userGrowth = $previousUsers > 0 ? round(($currentUsers / $previousUsers) * 100, 1) : 0;

        $previousPosts = Post::where('created_at', '<', $lastMonth)->count();
        $currentPosts = $totalPosts - $previousPosts;
        $postGrowth = $previousPosts > 0 ? round(($currentPosts / $previousPosts) * 100, 1) : 0;

        $previousJobs = Post::where('created_at', '<', $lastMonth)
                          ->where('parent_id', null)
                          ->count();
        $currentJobs = $totalJobs - $previousJobs;
        $jobGrowth = $previousJobs > 0 ? round(($currentJobs / $previousJobs) * 100, 1) : 0;

        return response()->json([
            'totalUsers' => $totalUsers,
            'totalStudents' => $totalStudents,
            'totalCompanies' => $totalCompanies,
            'totalProfessionals' => $totalProfessionals,
            'totalPosts' => $totalPosts,
            'totalJobs' => $totalJobs,
            'activeAds' => $activeAds,
            'pendingApprovals' => $pendingApprovals,
            'userGrowth' => $userGrowth,
            'postGrowth' => $postGrowth,
            'jobGrowth' => $jobGrowth,
        ]);
    }
}
