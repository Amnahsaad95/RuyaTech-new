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

        // Job growth calculation (using company hiring needs)
        $previousJobs = User::where('role', 'company')
                            ->where('created_at', '<', $lastMonth)
                            ->get()
                            ->reduce(function ($carry, $user) {
                                $hiringNeeds = $user->bio['hiring_needs'] ?? null;

                                if ($hiringNeeds && isset($hiringNeeds['open_positions'])) {
                                    return $carry + count($hiringNeeds['open_positions']);
                                }

                                return $carry;
                            }, 0);
        $currentJobs = $totalJobs - $previousJobs;
        $jobGrowth = $previousJobs > 0 ? round(($currentJobs / $previousJobs) * 100, 1) : 0;

        // User distribution for pie chart
        $userDistribution = [
            ['name' => 'Students', 'value' => $totalStudents],
            ['name' => 'Professionals', 'value' => $totalProfessionals],
            ['name' => 'Companies', 'value' => $totalCompanies]
        ];

        // Monthly activity for bar chart (last 6 months)
        $months = collect();
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthStart = $date->copy()->startOfMonth();
            $monthEnd = $date->copy()->endOfMonth();
            
            $monthData = [
                'month' => $date->format('M Y'),
                'users' => User::whereBetween('created_at', [$monthStart, $monthEnd])->count(),
                'posts' => Post::whereBetween('created_at', [$monthStart, $monthEnd])->count(),
                'jobs' => User::where('role', 'company')
                                ->whereBetween('created_at', [$monthStart, $monthEnd])
                                ->get()
                                ->reduce(function ($carry, $user) {
                                    $hiringNeeds = $user->bio['hiring_needs'] ?? null;

                                    if ($hiringNeeds && isset($hiringNeeds['open_positions'])) {
                                        return $carry + count($hiringNeeds['open_positions']);
                                    }

                                    return $carry;
                                }, 0)
            ];
            
            $months->push($monthData);
        }

        // Recent posts for table
        $recentPosts = Post::with('user')
                        ->where('status', 'published')
                        ->orderBy('created_at', 'desc')
                        ->take(5)
                        ->get()
                        ->map(function ($post) {
                            return [
                                'title' => $post->title,
                                'author' => $post->user ? $post->user->name : 'Unknown',
                                'status' => $post->status,
                                'likes' => $post->like,
                                'views' => $post->hit,
                                'created_at' => $post->created_at
                            ];
                        });

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
            'userDistribution' => $userDistribution,
            'monthlyActivity' => $months,
            'recentPosts' => $recentPosts
        ]);
    }
}
