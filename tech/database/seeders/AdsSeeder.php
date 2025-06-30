<?php

namespace Database\Seeders;

use App\Models\Ad;
use App\Models\Ads;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AdsSeeder extends Seeder
{
    public function run()
    {
        $syrianCities = [
            'دمشق', 'حلب', 'حمص', 'اللاذقية', 'حماة', 
            'طرطوس', 'دير الزور', 'الحسكة', 'الرقة', 'السويداء',
            'درعا', 'إدلب', 'القنيطرة', 'ريف دمشق'
        ];

        $techAds = [
            [
                'title' => 'تكنو سوريا',
                'description' => 'شركة برمجيات في دمشق تبحث عن مطور Laravel بخبرة لا تقل عن سنتين',
                'type' => 'job'
            ],
            [
                'title' => 'سيريان تك',
                'description' => 'دورة مكثفة لتعلم React.js مع مشاريع عملية - اونلاين',
                'type' => 'course'
            ],
            
           
            [
                'title' => 'سوريا تيك',
                'description' => 'مسابقة برمجة للشباب السوري - جوائز قيمة للفائزين',
                'type' => 'event'
            ],
            [
                'title' => 'أجهزة لاب توب جديدة',
                'description' => 'وصل جديد من أجهزة اللاب توب بمواصفات عالية وأسعار تنافسية',
                'type' => 'product'
            ]
        ];

        $statuses = [ 'published', 'unpublished', 'pending', 'rejected'];
        $images = [
            'ads/ads2.jpg',
            'ads/ads1.jpg',
            'ads/ads3.jpg',
            'ads/ads4.jpg',
        ];

        for ($i = 0; $i < 4; $i++) {
            $startDate = now()->addDays(rand(-30, 30));
            $endDate = $startDate->copy()->addDays(rand(15, 90));

            Ads::create([
                'FullName' => $techAds[$i]['title'],
                'ad_Url' => 'https://example.com/ads/' . ($i + 1),
                'Image' => $images[$i],
                'location' => $syrianCities[array_rand($syrianCities)],
                'hit' => rand(100, 5000),
                'status' => $statuses[array_rand($statuses)],
                'start_date' => $startDate->format('Y-m-d'),
                'End_date' => $endDate->format('Y-m-d'),
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }
    }
}