<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Validator;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\App;

class PostController extends Controller
{
     use AuthorizesRequests;
     /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Get all top-level posts (not comments)
        $posts = Post::whereNull('parent_id')
            ->with(['user'])
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($posts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
       // return response()->json("hiii");

        $locale = $request->header('Accept-Language');

        if (in_array($locale, ['ar', 'en'])) {
            App::setLocale($locale);
        }
       
        $validator = Validator::make($request->all(),[
            'title' => 'nullable|string',
            'content' => 'required|string',
            'image' => 'nullable|image|max:2048', // 2MB max
            'parent_id' => 'nullable|exists:posts,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => __('validation.failed'),
                'errors' => $validator->errors()
            ], 422);
        }

        $imagePath = null;
        
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('posts', 'public');
        }
        
        $post = Post::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'content' => $request->content,
            'image_path' => $imagePath,
            'parent_id' => $request->parent_id,
            'status'=>$request->status,
            'hit' => 0,
            'like' => 0
        ]);
        $post->load('user');
        
        return response()->json($post, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        $post->load(['user', 'comments.user']);
        
        return response()->json($post);
    }

    public function update(Request $request,$id)
    {
        
        $post = Post::findOrFail($id);
        
        $locale = $request->header('Accept-Language');

        if (in_array($locale, ['ar', 'en'])) {
            App::setLocale($locale);
        }

        $validator = Validator::make($request->all(),[
            'title' => 'nullable|string',
            'content' => 'nullable|string',
            'image_path' => 'nullable|image|max:4096',
            'status' => 'nullable|string',
            'like' => 'nullable|integer',
            'hit' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => __('validation.failed'),
                'errors' => $validator->errors()
            ], 422);
        }


        $data = $request->only([
            'title',
            'content',
            'status',
            'like',
            'hit',
        ]);

        // معالجة الصورة إذا كانت مرفوعة
        if ($request->hasFile('image_path')) {
            if ($post->image_path) {
                Storage::disk('public')->delete($post->image_path);
            }
            $data['image_path'] = $request->file('image_path')->store('posts', 'public');
        }

        $post->update($data);
        return response()->json($post);
    }

    public function destroy($id)
    {
       $post = Post::findOrFail($id);

        // Delete image if exists
        if ($post->image_path) {
            Storage::disk('public')->delete($post->image_path);
        }
        
        $post->delete();
        
        return response()->json(['message' => 'Post deleted'], 200);
    }
}
