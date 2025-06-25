<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ads extends Model
{
    use HasFactory;
	
	protected $table = "ads";

    protected $fillable = ['FullName', 'Image', 'hit', 'ad_Url','location','start_date', 'End_date','status'];
	
	protected function casts(): array
    {
        return [
            'start_date' => 'datetime',
            'End_date' => 'datetime',
        ];
    }
}
