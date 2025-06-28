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
                'title' => 'مطلوب مطور Laravel',
                'description' => 'شركة برمجيات في دمشق تبحث عن مطور Laravel بخبرة لا تقل عن سنتين',
                'type' => 'job'
            ],
            [
                'title' => 'دورة تعلم React.js',
                'description' => 'دورة مكثفة لتعلم React.js مع مشاريع عملية - اونلاين',
                'type' => 'course'
            ],
            [
                'title' => 'شاشات كمبيوتر مستعملة',
                'description' => 'بيع شاشات كمبيوتر مستعملة بحالة جيدة - جميع المقاسات',
                'type' => 'product'
            ],
            [
                'title' => 'استضافة مواقع ويب',
                'description' => 'حلول استضافة مواقع ويب بسرعات عالية ودعم فني مميز',
                'type' => 'service'
            ],
            [
                'title' => 'مطلوب مصمم UX/UI',
                'description' => 'مطلوب مصمم واجهات مستخدم بخبرة في Figma وAdobe XD',
                'type' => 'job'
            ],
            [
                'title' => 'مسابقة برمجة',
                'description' => 'مسابقة برمجة للشباب السوري - جوائز قيمة للفائزين',
                'type' => 'event'
            ],
            [
                'title' => 'أجهزة لاب توب جديدة',
                'description' => 'وصل جديد من أجهزة اللاب توب بمواصفات عالية وأسعار تنافسية',
                'type' => 'product'
            ],
            [
                'title' => 'تدريب أمن سيبراني',
                'description' => 'برنامج تدريبي متخصص في الأمن السيبراني مع شهادة معتمدة',
                'type' => 'course'
            ],
            [
                'title' => 'تطوير تطبيقات الجوال',
                'description' => 'فريق محترف لتطوير تطبيقات الجوال (Android و iOS)',
                'type' => 'service'
            ],
            [
                'title' => 'هاكاثون التكنولوجيا',
                'description' => 'هاكاثون تقني لمطوري البرمجيات في سوريا - فرصة للتوظيف',
                'type' => 'event'
            ]
        ];

        $statuses = [ 'published', 'unpublished', 'pending', 'rejected'];
        $images = [
            'ad1.jpg',
            'ad2.jpg',
            'ad3.jpg',
            'ad4.jpg',
            'ad5.jpg',
            'ad6.jpg',
            'ad7.jpg',
            'ad8.jpg',
            'ad9.jpg',
            'ad10.jpg'
        ];

        for ($i = 0; $i < 10; $i++) {
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