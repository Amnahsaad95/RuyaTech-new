<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
         return [
            'id' => $this->id,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
            'parent_id' => $this->parent_id,
            'title' => $this->title,
            'body' => $this->body,
            'reactions' => $this->reactions->groupBy('type')->map->count(),
            'comments_count' => $this->children->count(),
            'created_at' => $this->created_at->diffForHumans(),
            'updated_at' => $this->updated_at,
        ];
    }
}
