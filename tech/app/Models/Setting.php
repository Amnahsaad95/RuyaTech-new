<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Setting extends Model
{
    use HasFactory;
	
	protected $table = "settings";

    protected $fillable = ['site_name', 'site_icon', 'site_logo','sitemail', 'facebook_url','instagram_url',
							'whatsapp_number', 'intro_image_1','intro_image_2','intro_image_3','intro_title_1',
							'intro_text_1','intro_title_2','intro_text_2','intro_title_3','intro_text_3',
							'intro_title_1_Ar','intro_text_1_Ar','intro_title_2_Ar','intro_text_2_Ar','intro_title_3_Ar','intro_text_3_Ar',
							'site_location','siteDescription','siteDescriptionAr'];
}
