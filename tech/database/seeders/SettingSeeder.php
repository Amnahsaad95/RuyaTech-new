<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\DB;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $setting= [
					'site_name'=>'Rüya Tech',
					'site_name_Ar'=>' رؤيا تيك',
					'sitemail' => 'contact@ruyatech.com',
					'site_icon' => 'Icon_1744269375_67f7703f50533.png',
					'facebook_url' => 'https://facebook.com/',
					'instagram_url' => 'https://instagram.com/',
					'whatsapp_number' => '1234567890', 
					'intro_title_1' => 'The Hub of Tech in Syria',
					'intro_text_1' => 'A platform uniting experts, companies, and students to share knowledge, create opportunities, and shape Syria’s tech future.',
					'intro_title_2' => 'Technology Makes the Difference!',
					'intro_text_2' =>  'We believe in the power of tech collaboration — where ideas start, projects grow, and success happens.',
					'intro_title_3' => 'Post Your Ad Easily!',
					'intro_text_3' => 'Share your ad with thousands of daily visitors — just a few simple steps to get noticed.',
					'intro_title_1_Ar' => 'ملتقى التقنيين في سوريا',
					'intro_text_1_Ar' => 'منصة تجمع بين الخبراء، الشركات، والطلاب لتبادل المعرفة، بناء الفرص، وتطوير المستقبل التقني في سوريا.',
					'intro_title_2_Ar' => 'التقانة تصنع الفرق!',
					'intro_text_2_Ar' => 'نؤمن بقوة التعاون التقني — هنا تبدأ الأفكار، وتُبنى المشاريع، وتُصنع الإنجازات.',
					'intro_title_3_Ar' => 'أضف إعلانك بكل سهولة!',
					'intro_text_3_Ar' => 'شارك إعلانك مع آلاف الزوار يوميًا — فقط ببضع خطوات بسيطة، اجعل الجميع يرى ما تقدمه.',
					'site_location' => '123, Homs Syria',
					'siteDescription' => 'One Tech Community... Many Visions ... Students, developers, startups, and professionals — all connected to learn, build, and thrive together.',
					'siteDescriptionAr' => 'مجتمع تقني واحد ... رؤى متعددة ... طلاب، مبرمجون، شركات ناشئة، وخبراء — يجتمعون في مكان واحد لتبادل الخبرات والنجاح معًا.',
					];
							
		DB::table('settings')->insert($setting);
    }
}
