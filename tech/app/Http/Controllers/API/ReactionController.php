<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\Reaction;

use Illuminate\Support\Facades\Auth;

class ReactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // This endpoint might not be needed in most cases
        // as reactions are typically accessed through posts
        return response()->json(['message' => 'Access reactions through posts'], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'post_id' => 'required|exists:posts,id',
            'type' => 'required|string|in:like,love,haha,wow,sad,angry'
        ]);
        
        // Check if user already reacted to this post
        $existingReaction = Reaction::where('user_id', Auth::id())
            ->where('post_id', $request->post_id)
            ->first();
            
        if ($existingReaction) {
            // Update existing reaction if type is different
            if ($existingReaction->type !== $request->type) {
                $existingReaction->update(['type' => $request->type]);
                return response()->json($existingReaction);
            }
            
            // If same reaction type, remove it (toggle behavior)
            $existingReaction->delete();
            return response()->json(null, 204);
        }
        
        // Create new reaction
        $reaction = Reaction::create([
            'user_id' => Auth::id(),
            'post_id' => $request->post_id,
            'type' => $request->type
        ]);
        
        return response()->json($reaction, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Reaction $reaction)
    {
        return response()->json($reaction->load('user'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Reaction $reaction)
    {
        // Check if the authenticated user owns this reaction
        if ($reaction->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $request->validate([
            'type' => 'required|string|in:like,love,haha,wow,sad,angry'
        ]);
        
        $reaction->update(['type' => $request->type]);
        
        return response()->json($reaction);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reaction $reaction)
    {
        // Check if the authenticated user owns this reaction
        if ($reaction->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $reaction->delete();
        
        return response()->json(null, 204);
    }
    
    /**
     * Get all reactions for a specific post.
     */
    public function getPostReactions(Post $post)
    {
        $reactions = $post->reactions()
            ->with('user')
            ->get()
            ->groupBy('type');
            
        return response()->json($reactions);
    }
    
    /**
     * Get reaction counts by type for a specific post.
     */
    public function getReactionCounts(Post $post)
    {
        $counts = $post->reactions()
            ->select('type')
            ->selectRaw('count(*) as count')
            ->groupBy('type')
            ->get();
            
        return response()->json($counts);
    }
}
