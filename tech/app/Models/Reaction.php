<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Reaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'post_id',
        'type',
    ];

     /**
     * Get the user that owns the reaction.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the post that owns the reaction.
     */
    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
