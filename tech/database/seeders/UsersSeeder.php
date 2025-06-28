<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    public function run()
    {
        $syrianCities = [
            'دمشق', 'حلب', 'حمص', 'اللاذقية', 'حماة', 
            'طرطوس', 'دير الزور', 'الحسكة', 'الرقة', 'السويداء',
            'درعا', 'إدلب', 'القنيطرة', 'ريف دمشق'
        ];

        $techSkills = [
            ['name' => 'برمجة PHP', 'experience' => 'متقدم'],
            ['name' => 'لارافيل', 'experience' => 'متقدم'],
            ['name' => 'React.js', 'experience' => 'متوسط'],
            ['name' => 'قواعد البيانات', 'experience' => 'متقدم'],
            ['name' => 'التصميم UX/UI', 'experience' => 'مبتدئ'],
            ['name' => 'أمن المعلومات', 'experience' => 'متوسط'],
            ['name' => 'تعلم الآلة', 'experience' => 'مبتدئ'],
            ['name' => 'تحليل البيانات', 'experience' => 'متوسط'],
        ];

        $techSkills1 = [ 'برمجة PHP',  'لارافيل','React.js','قواعد البيانات',  'التصميم UX/UI',  'أمن المعلومات',  'تعلم الآلة',  'تحليل البيانات', ];

        $languages = ['العربية', 'الإنجليزية', 'الفرنسية', 'الألمانية'];

        $techInterests = [
            'الذكاء الاصطناعي', 'تطوير الويب', 'الأمن السيبراني',
            'علم البيانات', 'بلوك تشين', 'إنترنت الأشياء'
        ];

        // Admin User
        User::create([
            'name' => 'أحمد علي',
            'email' => 'admin@tech.sy',
            'password' => Hash::make('password'),
            'phone' => '0933111222',
            'role' => 'admin',
            'status' => 'approved',
            'city' => 'دمشق',
            'country' => 'سوريا',
            'profile_image' => 'admin-profile.jpg',
            'bio' => [
                'professional_info' => [
                    'title' => 'مدير نظام',
                    'years_experience' => 8,
                    'skills' => [
                        ['name' => 'إدارة الفرق', 'experience' => 'متقدم'],
                        ['name' => 'تخطيط المشاريع', 'experience' => 'متقدم']
                    ],
                    'languages' => ['العربية', 'الإنجليزية']
                ],
                'summary' => 'مدير نظام بخبرة 8 سنوات في إدارة فرق التطوير وتنفيذ المشاريع التقنية الكبيرة.'
            ]
        ]);

        // Professional Users (10)
        for ($i = 1; $i <= 10; $i++) {
            $city = $syrianCities[array_rand($syrianCities)];
            $randomSkills = array_rand($techSkills, 4);
            $selectedSkills = [
                $techSkills[$randomSkills[0]],
                $techSkills[$randomSkills[1]],
                $techSkills[$randomSkills[2]],
                $techSkills[$randomSkills[3]]
            ];
            
            $randomLanguages = array_rand($languages, rand(1, 3));
            $selectedLanguages = is_array($randomLanguages) 
                ? array_map(fn($idx) => $languages[$idx], $randomLanguages)
                : [$languages[$randomLanguages]];
            
            User::create([
                'name' => $this->arabicNames()['professional'][$i-1],
                'email' => "professional$i@tech.sy",
                'password' => Hash::make('password'),
                'phone' => '09' . rand(1000000, 9999999),
                'role' => 'professional',
                'status' => 'approved',
                'city' => $city,
                'country' => 'سوريا',
                'mainfield' => ['تطوير الويب', 'الأمن السيبراني', 'علم البيانات'][rand(0, 2)],
                'isexpert' => rand(0, 1),
                'bio' => [
                    'professional_info' => [
                        'title' => ['مطور ويب', 'مهندس برمجيات', 'محلل بيانات'][rand(0, 2)],
                        'years_experience' => rand(1, 10),
                        'skills' => $selectedSkills,
                        'languages' => $selectedLanguages
                    ],
                    'education' => [
                        [
                            'degree' => ['بكالوريوس علوم حاسوب', 'ماجستير ذكاء اصطناعي', 'دبلوم شبكات'][rand(0, 2)],
                            'institution' => ['جامعة دمشق', 'جامعة حلب', 'الجامعة الافتراضية'][rand(0, 2)],
                            'year' => rand(2010, 2022)
                        ]
                    ],
                    'work_history' => [
                        [
                            'position' => ['مطور Laravel', 'مهندس DevOps', 'مصمم UX'][rand(0, 2)],
                            'company' => ['شركة سيريان تك', 'ديجيتال سوليوشنز', 'تكنو سوريا'][rand(0, 2)],
                            'start_year' => (string)rand(2015, 2020),
                            'end_year' => rand(0, 1) ? (string)rand(2018, 2023) : null,
                            'is_current' => rand(0, 1),
                            'description' => 'عملت على تطوير أنظمة إدارة المحتوى وتحسين أداء المواقع الإلكترونية.'
                        ]
                    ],
                    'summary' => 'محترف في مجال التكنولوجيا مع خبرة في تطوير الحلول البرمجية المبتكرة.'
                ]
            ]);
        }

        // Company Users (5)
        $techCompanies = [
            'سيريان تك', 'ديجيتال سوليوشنز', 'تكنو سوريا', 
            'بلو سايبر', 'دارتك', 'كود سوريا'
        ];
        
        for ($i = 1; $i <= 5; $i++) {
            $city = $syrianCities[array_rand($syrianCities)];
            
            User::create([
                'name' => $techCompanies[$i-1],
                'email' => "company$i@tech.sy",
                'password' => Hash::make('password'),
                'phone' => '09' . rand(1000000, 9999999),
                'role' => 'company',
                'status' => 'approved',
                'city' => $city,
                'country' => 'سوريا',
                'bio' => [
                    'company_info' => [
                        'legal_name' => $techCompanies[$i-1] . ' ش.م.م',
                        'founded_year' => rand(2010, 2020),
                        'company_size' => ['1-10 موظفين', '11-50 موظف', '51-200 موظف'][rand(0, 2)],
                        'industry' => ['تطوير البرمجيات', 'الأمن السيبراني', 'الذكاء الاصطناعي'],
                        'website' => "https://www.{$techCompanies[$i-1]}.com",
                        'headquarters' => $city
                    ],
                    'hiring_needs' => [
                        'open_positions' => [
                            [
                                'title' => ['مطور ويب', 'مهندس بيانات', 'مصمم جرافيك'][rand(0, 2)],
                                'department' => 'التطوير',
                                'location' => $city
                            ]
                        ],
                        'hiring_process' => ['مقابلة تقنية', 'اختبار برمجي', 'مقابلة شخصية']
                    ],
                    'summary' => 'شركة رائدة في مجال الحلول البرمجية والتكنولوجية في سوريا.'
                ]
            ]);
        }

        // Student Users (14)
        $universities = [
            'جامعة دمشق', 'جامعة حلب', 'جامعة تشرين', 
            'الجامعة الافتراضية', 'جامعة البعث'
        ];
        
        for ($i = 1; $i <= 14; $i++) {
            $city = $syrianCities[array_rand($syrianCities)];
            $randomInterests = array_rand($techInterests, 2);
            $selectedInterests = is_array($randomInterests)
                ? [$techInterests[$randomInterests[0]], $techInterests[$randomInterests[1]]]
                : [$techInterests[$randomInterests]];
            
            User::create([
                'name' => $this->arabicNames()['student'][$i-1],
                'email' => "student$i@edu.sy",
                'password' => Hash::make('password'),
                'phone' => '09' . rand(1000000, 9999999),
                'role' => 'student',
                'status' => 'approved',
                'city' => $city,
                'country' => 'سوريا',
                'isjobseek' => rand(0, 1),
                'bio' => [
                    'academic_info' => [
                        'institution' => $universities[rand(0, 4)],
                        'program' => ['علوم حاسوب', 'هندسة معلوماتية', 'ذكاء اصطناعي'][rand(0, 2)],
                        'degree_level' => ['بكالوريوس', 'ماجستير'][rand(0, 1)],
                        'year' => (string)rand(2019, 2023)
                    ],
                    'courses' => [
                        [
                            'name' => ['خوارزميات', 'قواعد بيانات', 'شبكات الحاسوب'][rand(0, 2)],
                            'semester' => ['الأول', 'الثاني', 'الصيفي'][rand(0, 2)],
                            'grade' => ['ممتاز', 'جيد جداً', 'جيد'][rand(0, 2)],
                            'year' => (string)rand(2019, 2023)
                        ]
                    ],
                    'skills_learning' => [
                        $techSkills1[array_rand($techSkills1)],
                        $techSkills1[array_rand($techSkills1)],
                        $techSkills1[array_rand($techSkills1)]
                    ],
                    'interests' => $selectedInterests,
                    'summary' => 'طالب في مجال الحاسوب مهتم بأحدث التقنيات ويسعى لتطوير مهاراته.'
                ]
            ]);
        }
    }

    private function arabicNames()
    {
        return [
            'professional' => [
                'محمد حسن', 'علي أحمد', 'سامر خالد', 
                'نورا عبد الله', 'ريماس ناصر', 'ياسين عمر',
                'لمى سليمان', 'باسل فارس', 'ديما قاسم', 'وسام رامي'
            ],
            'student' => [
                'أحمد نبيل', 'سارة محمد', 'عمر خالد', 
                'هبة علي', 'مجد حسين', 'تالا أسعد',
                'وسيم رافع', 'جنى سامي', 'نادر وائل', 'لين عماد',
                'زياد باسل', 'هاني ماهر', 'آية نزار', 'فارس وسيم'
            ]
        ];
    }
}