<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Professionals (10 users)
        $this->createProfessionalUsers();

        // Students (10 users)
        $this->createStudentUsers();

        // Companies (5 users)
        $this->createCompanyUsers();

        // Admin
        User::create([
            'name' => 'المدير العام',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'status' => 'approved',
            'email_verified_at' => now(),
            'city' => 'دمشق',
            'country' => 'سوريا',
        ]);
    }

    private function createProfessionalUsers()
    {
        $arabicNames = [
            'أحمد محمد', 'علي حسن', 'مريم خالد', 'سارة ناصر', 'خالد إبراهيم',
            'فاطمة عمر', 'يوسف رامي', 'نورا أسامة', 'حسين وائل', 'ليلى سمير'
        ];

        $professions = [
            'مهندس برمجيات', 'عالم بيانات', 'مصمم واجهات', 
            'مدير منتج', 'مهندس ديفوبس', 'أخصائي أمن سيبراني',
            'مدير تسويق', 'محلل مالي', 'أخصائي موارد بشرية'
        ];

        $syrianCities = ['دمشق', 'حلب', 'حمص', 'اللاذقية', 'حماة', 'طرطوس', 'دير الزور', 'السويداء', 'القنيطرة', 'درعا'];

        for ($i = 0; $i < 10; $i++) {
            $city = $syrianCities[array_rand($syrianCities)];
            
            $bio = [
                'professional_info' => [
                    'title' => $professions[array_rand($professions)],
                    'years_experience' => rand(2, 15),
                    'skills' => [
                        ['name' => 'JavaScript', 'experience' => rand(1, 5) . ' سنوات'],
                        ['name' => 'Python', 'experience' => rand(1, 5) . ' سنوات'],
                        ['name' => 'إدارة المشاريع', 'experience' => rand(1, 5) . ' سنوات'],
                    ],
                    'languages' => ['العربية', 'الإنجليزية', 'الفرنسية'],
                ],
                'education' => [
                    [
                        'degree' => 'بكالوريوس في علوم الحاسوب',
                        'institution' => 'جامعة دمشق',
                        'year' => rand(2005, 2020),
                    ]
                ],
                'work_history' => [
                    [
                        'position' => 'مطور برمجيات',
                        'company' => 'شركة تقنية المعلومات',
                        'start_year' => (string) rand(2015, 2020),
                        'end_year' => (string) rand(2018, 2022),
                        'is_current' => false,
                        'description' => 'تطوير تطبيقات الويب باستخدام تقنيات حديثة',
                    ],
                    [
                        'position' => 'مطور أول',
                        'company' => 'شركة الحلول البرمجية',
                        'start_year' => (string) rand(2018, 2021),
                        'end_year' => null,
                        'is_current' => true,
                        'description' => 'قيادة فريق تطوير وبناء أنظمة متكاملة',
                    ]
                ],
                'summary' => 'محترف ذو خبرة واسعة في مجال التطوير البرمجي وإدارة المشاريع التقنية',
            ];

            User::create([
                'name' => $arabicNames[$i],
                'email' => 'professional' . ($i+1) . '@example.com',
                'password' => Hash::make('password'),
                'role' => 'professional',
                'status' => $i < 8 ? 'approved' : ($i < 9 ? 'pending' : 'suspended'), // Mix statuses
                'email_verified_at' => rand(0, 1) ? now()->subDays(rand(1, 365)) : null,
                'phone' => '963' . rand(900000000, 999999999),
                'city' => $city,
                'country' => 'سوريا',
                'mainfield' => 'تكنولوجيا المعلومات',
                'isexpert' => rand(0, 1),
                'isjobseek' => rand(0, 1),
                'bio' => $bio,
            ]);
        }
    }

    private function createStudentUsers()
    {
        $arabicNames = [
            'أيمن سعيد', 'هبة قاسم', 'وسام ربيع', 'جنى فارس', 'باسل نهاد',
            'رنا عدنان', 'مازن وسام', 'سلمى ياسر', 'طلال بشار', 'هاني رامي'
        ];

        $fields = [
            'علوم الحاسوب', 'إدارة الأعمال', 'الهندسة الكهربائية',
            'الطب', 'القانون', 'الهندسة المعمارية'
        ];

        $syrianUniversities = [
            'جامعة دمشق', 'جامعة حلب', 'جامعة تشرين', 'جامعة البعث', 
            'الجامعة الافتراضية السورية', 'جامعة حماه', 'جامعة الفرات'
        ];

        $syrianCities = ['دمشق', 'حلب', 'حمص', 'اللاذقية', 'حماة', 'طرطوس', 'دير الزور', 'السويداء', 'القنيطرة', 'درعا'];

        for ($i = 0; $i < 10; $i++) {
            $city = $syrianCities[array_rand($syrianCities)];
            
            $bio = [
                'academic_info' => [
                    'institution' => $syrianUniversities[array_rand($syrianUniversities)],
                    'program' => $fields[array_rand($fields)],
                    'degree_level' => ['بكالوريوس', 'ماجستير', 'دكتوراه'][rand(0, 2)],
                    'year' => (string) rand(2018, 2023),
                ],
                'courses' => [
                    [
                        'code' => 'CS101',
                        'name' => 'مقدمة في البرمجة',
                        'semester' => 'الخريف',
                        'grade' => ['ممتاز', 'جيد جداً', 'جيد'][rand(0, 2)],
                        'year' => '2022',
                    ],
                    [
                        'code' => 'MATH202',
                        'name' => 'الجبر الخطي',
                        'semester' => 'الربيع',
                        'grade' => ['ممتاز', 'جيد جداً', 'جيد'][rand(0, 2)],
                        'year' => '2021',
                    ]
                ],
                'skills_learning' => ['بايثون', 'تعلم الآلة', 'هياكل البيانات'],
                'interests' => ['الذكاء الاصطناعي', 'الروبوتات', 'بلوك تشين'],
                'summary' => 'طالب طموح يبحث عن فرص تدريب لتطبيق المعرفة المكتسبة',
            ];

            User::create([
                'name' => $arabicNames[$i],
                'email' => 'student' . ($i+1) . '@example.com',
                'password' => Hash::make('password'),
                'role' => 'student',
                'status' => $i < 8 ? 'approved' : 'pending', // Mostly approved
                'email_verified_at' => rand(0, 1) ? now()->subDays(rand(1, 365)) : null,
                'phone' => '963' . rand(900000000, 999999999),
                'city' => $city,
                'country' => 'سوريا',
                'mainfield' => $fields[array_rand($fields)],
                'isjobseek' => rand(0, 1),
                'bio' => $bio,
            ]);
        }
    }

    private function createCompanyUsers()
    {
        $companyNames = [
            'شركة الحلول التقنية', 'مجموعة الأعمال الحديثة', 'شركة الإبداع البرمجي',
            'مؤسسة التقنية المتطورة', 'شركة سيرفكا للخدمات'
        ];

        $industries = [
            'التقنية', 'التمويل', 'الرعاية الصحية', 'التعليم', 'التصنيع', 'التجزئة'
        ];

        $services = [
            'التطوير البرمجي', 'الاستشارات', 'خدمات السحابة',
            'التسويق الرقمي', 'حلول التوظيف', 'التدريب'
        ];

        $syrianCities = ['دمشق', 'حلب', 'حمص', 'اللاذقية', 'حماة'];

        for ($i = 0; $i < 5; $i++) {
            $city = $syrianCities[array_rand($syrianCities)];
            
            $bio = [
                'company_info' => [
                    'legal_name' => $companyNames[$i],
                    'founded_year' => rand(2000, 2020),
                    'company_size' => rand(10, 500) . ' موظف',
                    'industry' => array_slice($industries, 0, rand(1, 3)),
                    'website' => 'https://company' . ($i+1) . '.com',
                    'headquarters' => $city . ', سوريا',
                ],
                'services' => array_slice($services, 0, rand(2, 4)),
                'hiring_needs' => [
                    'open_positions' => [
                        [
                            'title' => 'مهندس برمجيات',
                            'department' => 'الهندسة',
                            'location' => $city,
                        ],
                        [
                            'title' => 'أخصائي تسويق',
                            'department' => 'التسويق',
                            'location' => $city,
                        ]
                    ],
                    'hiring_process' => ['مقابلة تقنية', 'مقابلة موارد بشرية', 'اختبار عملي'],
                ],
                'summary' => 'شركة رائدة في تقديم الحلول التقنية المتكاملة في سوريا',
            ];

            User::create([
                'name' => $companyNames[$i],
                'email' => 'company' . ($i+1) . '@example.com',
                'password' => Hash::make('password'),
                'role' => 'company',
                'status' => $i < 4 ? 'approved' : 'pending', // Mostly approved
                'email_verified_at' => now()->subDays(rand(1, 365)),
                'phone' => '963' . rand(900000000, 999999999),
                'city' => $city,
                'country' => 'سوريا',
                'bio' => $bio,
            ]);
        }
    }
}