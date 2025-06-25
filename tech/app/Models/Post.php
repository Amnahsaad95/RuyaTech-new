<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'content',
        'image_path',
        'parent_id',
        'status',
        'hit',
        'like'
    ];

     /**
     * Get the user that owns the post.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the parent post if this is a comment.
     */
    public function parent()
    {
        return $this->belongsTo(Post::class, 'parent_id');
    }

    /**
     * Get the comments (child posts) for this post.
     */
    public function comments()
    {
        return $this->hasMany(Post::class, 'parent_id');
    }

    /**
     * Get the reactions for this post.
     */
    public function reactions()
    {
        return $this->hasMany(Reaction::class);
    }
}

