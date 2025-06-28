<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class TechnicalUsersSeeder extends Seeder
{
    private $programmingLanguages = [
        'JavaScript', 'Python', 'Java', 'PHP', 'C#', 'C++', 'TypeScript', 'Ruby', 'Swift', 'Kotlin',
        'Go', 'Rust', 'Dart', 'Scala', 'R', 'Perl', 'Haskell', 'Elixir', 'Clojure', 'Lua'
    ];

    private $frameworks = [
        'React', 'Angular', 'Vue.js', 'Laravel', 'Django', 'Spring', 'Express', 'Flask', 'Ruby on Rails',
        'ASP.NET', 'Flutter', 'React Native', 'TensorFlow', 'PyTorch', 'Node.js'
    ];

    private $databases = [
        'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'SQL Server', 'Firebase', 'Cassandra', 'Elasticsearch'
    ];

    private $devOpsTools = [
        'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Terraform', 'Ansible', 'Jenkins', 'GitLab CI/CD', 'GitHub Actions'
    ];

    private $cloudPlatforms = [
        'AWS', 'Azure', 'Google Cloud', 'IBM Cloud', 'Oracle Cloud', 'Alibaba Cloud'
    ];

    public function run()
    {
        $users = [
            // Admin (Technical)
            [
                'name' => 'علي التقني',
                'email' => 'admin@tech.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'status' => 'approved',
                'email_verified_at' => Carbon::now(),
                'phone' => '0933111111',
                'city' => 'دمشق',
                'country' => 'سوريا',
                'National' => 'سوري',
                'mainfield' => 'هندسة البرمجيات',
                'isexpert' => true,
                'isjobseek' => false,
                'bio' => json_encode([
                    'professional_info' => [
                        'title' => 'كبير مهندسي البرمجيات',
                        'years_experience' => 10,
                        'skills' => [
                            ['name' => 'Python', 'experience' => '8 سنوات'],
                            ['name' => 'Django', 'experience' => '6 سنوات'],
                            ['name' => 'AWS', 'experience' => '5 سنوات'],
                            ['name' => 'Kubernetes', 'experience' => '4 سنوات']
                        ],
                        'languages' => ['العربية', 'الإنجليزية']
                    ],
                    'education' => [
                        [
                            'degree' => 'بكالوريوس في هندسة البرمجيات',
                            'institution' => 'جامعة دمشق',
                            'year' => 2010
                        ],
                        [
                            'degree' => 'ماجستير في الذكاء الاصطناعي',
                            'institution' => 'جامعة حلب',
                            'year' => 2014
                        ]
                    ],
                    'work_history' => [
                        [
                            'position' => 'مهندس برمجيات',
                            'company' => 'شركة الحلول التقنية',
                            'start_year' => '2011',
                            'end_year' => '2015',
                            'is_current' => false,
                            'description' => 'تطوير تطبيقات الويب باستخدام Python و Django'
                        ],
                        [
                            'position' => 'كبير المهندسين',
                            'company' => 'شركة التقنية المتقدمة',
                            'start_year' => '2015',
                            'is_current' => true,
                            'description' => 'قيادة فريق تطوير وتصميم هندسة الأنظمة'
                        ]
                    ],
                    'certifications' => [
                        [
                            'name' => 'AWS Certified Solutions Architect',
                            'issuer' => 'Amazon Web Services',
                            'year' => '2018'
                        ]
                    ],
                    'summary' => 'خبير في هندسة البرمجيات والحلول السحابية مع 10 سنوات من الخبرة'
                ]),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],

            // Technical Professionals (20)
            [
                'name' => 'محمد المطور',
                'email' => 'mohamed.developer@tech.com',
                'password' => Hash::make('password123'),
                'role' => 'professional',
                'status' => 'approved',
                'email_verified_at' => Carbon::now(),
                'phone' => '0933222222',
                'city' => 'حلب',
                'country' => 'سوريا',
                'National' => 'سوري',
                'mainfield' => 'تطوير الويب',
                'isexpert' => true,
                'isjobseek' => false,
                'bio' => json_encode([
                    'professional_info' => [
                        'title' => 'مطور ويب كامل',
                        'years_experience' => 5,
                        'skills' => [
                            ['name' => 'JavaScript', 'experience' => '5 سنوات'],
                            ['name' => 'React', 'experience' => '4 سنوات'],
                            ['name' => 'Node.js', 'experience' => '3 سنوات'],
                            ['name' => 'MongoDB', 'experience' => '3 سنوات']
                        ],
                        'languages' => ['العربية', 'الإنجليزية']
                    ],
                    'education' => [
                        [
                            'degree' => 'بكالوريوس في هندسة المعلوماتية',
                            'institution' => 'جامعة حلب',
                            'year' => 2016
                        ]
                    ],
                    'work_history' => [
                        [
                            'position' => 'مطور واجهة أمامية',
                            'company' => 'شركة الويب الحديث',
                            'start_year' => '2017',
                            'end_year' => '2019',
                            'is_current' => false,
                            'description' => 'تطوير واجهات مستخدم باستخدام React'
                        ],
                        [
                            'position' => 'مطور كامل',
                            'company' => 'شركة التكنولوجيا السريعة',
                            'start_year' => '2019',
                            'is_current' => true,
                            'description' => 'تطوير تطبيقات ويب كاملة باستخدام MERN stack'
                        ]
                    ],
                    'portfolio' => [
                        [
                            'title' => 'نظام إدارة المحتوى',
                            'description' => 'نظام إدارة محتوى مبني على React و Node.js',
                            'url' => 'https://github.com/example/cms'
                        ]
                    ],
                    'summary' => 'مطور ويب كامل متخصص في JavaScript وتقنيات الويب الحديثة'
                ]),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],

            [
                'name' => 'سارة المبرمجة',
                'email' => 'sara.programmer@tech.com',
                'password' => Hash::make('password123'),
                'role' => 'professional',
                'status' => 'approved',
                'email_verified_at' => Carbon::now(),
                'phone' => '0933333333',
                'city' => 'دمشق',
                'country' => 'سوريا',
                'National' => 'سورية',
                'mainfield' => 'علم البيانات',
                'isexpert' => true,
                'isjobseek' => true,
                'bio' => json_encode([
                    'professional_info' => [
                        'title' => 'عالمة بيانات',
                        'years_experience' => 4,
                        'skills' => [
                            ['name' => 'Python', 'experience' => '4 سنوات'],
                            ['name' => 'TensorFlow', 'experience' => '3 سنوات'],
                            ['name' => 'SQL', 'experience' => '4 سنوات'],
                            ['name' => 'Data Visualization', 'experience' => '3 سنوات']
                        ],
                        'languages' => ['العربية', 'الإنجليزية', 'الفرنسية']
                    ],
                    'education' => [
                        [
                            'degree' => 'بكالوريوس في علوم الحاسوب',
                            'institution' => 'جامعة دمشق',
                            'year' => 2017
                        ],
                        [
                            'degree' => 'ماجستير في علم البيانات',
                            'institution' => 'جامعة دمشق',
                            'year' => 2019
                        ]
                    ],
                    'work_history' => [
                        [
                            'position' => 'محللة بيانات',
                            'company' => 'شركة التحليلات الذكية',
                            'start_year' => '2018',
                            'end_year' => '2020',
                            'is_current' => false,
                            'description' => 'تحليل البيانات وإنشاء نماذج تنبؤية'
                        ],
                        [
                            'position' => 'عالمة بيانات',
                            'company' => 'شركة الذكاء الاصطناعي',
                            'start_year' => '2020',
                            'is_current' => true,
                            'description' => 'بناء نماذج تعلم آلي وتطوير خوارزميات'
                        ]
                    ],
                    'summary' => 'عالمة بيانات متخصصة في التعلم الآلي وتحليل البيانات'
                ]),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]
        ];

        // Generate 18 more technical professionals
        for ($i = 3; $i <= 20; $i++) {
            $yearsExp = rand(1, 10);
            $skillsCount = rand(3, 6);
            $skills = [];
            
            for ($j = 0; $j < $skillsCount; $j++) {
                $category = rand(0, 3);
                $skillName = '';
                $expYears = rand(1, $yearsExp);
                
                switch ($category) {
                    case 0:
                        $skillName = $this->programmingLanguages[array_rand($this->programmingLanguages)];
                        break;
                    case 1:
                        $skillName = $this->frameworks[array_rand($this->frameworks)];
                        break;
                    case 2:
                        $skillName = $this->databases[array_rand($this->databases)];
                        break;
                    case 3:
                        $skillName = $this->devOpsTools[array_rand($this->devOpsTools)];
                        break;
                }
                
                $skills[] = ['name' => $skillName, 'experience' => $expYears . ' سنوات'];
            }
            
            $specializations = [
                'تطوير الويب', 'تطوير الجوال', 'علم البيانات', 'الذكاء الاصطناعي',
                'أمن المعلومات', 'DevOps', 'هندسة البرمجيات', 'تطوير الألعاب'
            ];
            
            $users[] = [
                'name' => 'مطور ' . $i,
                'email' => 'dev' . $i . '@tech.com',
                'password' => Hash::make('password123'),
                'role' => 'professional',
                'status' => 'approved',
                'email_verified_at' => Carbon::now(),
                'phone' => '0933' . rand(100000, 999999),
                'city' => ['دمشق', 'حلب', 'حمص', 'اللاذقية'][rand(0, 3)],
                'country' => 'سوريا',
                'National' => 'سوري',
                'mainfield' => $specializations[rand(0, count($specializations) - 1)],
                'isexpert' => rand(0, 1),
                'isjobseek' => rand(0, 1),
                'bio' => json_encode([
                    'professional_info' => [
                        'title' => 'مهندس برمجيات',
                        'years_experience' => $yearsExp,
                        'skills' => $skills,
                        'languages' => ['العربية', 'الإنجليزية']
                    ],
                    'education' => [
                        [
                            'degree' => 'بكالوريوس في ' . ['هندسة البرمجيات', 'علوم الحاسوب', 'هندسة الحاسوب'][rand(0, 2)],
                            'institution' => ['جامعة دمشق', 'جامعة حلب', 'جامعة البعث', 'جامعة تشرين'][rand(0, 3)],
                            'year' => (2022 - $yearsExp - rand(1, 3))
                        ]
                    ],
                    'work_history' => [
                        [
                            'position' => ['مهندس برمجيات', 'مطور', 'محلل نظم', 'مهندس DevOps'][rand(0, 3)],
                            'company' => 'شركة ' . ['التقنية', 'البرمجيات', 'الحلول الذكية', 'الذكاء الاصطناعي'][rand(0, 3)],
                            'start_year' => (string)(2020 - rand(1, $yearsExp)),
                            'is_current' => true,
                            'description' => 'تطوير وتنفيذ حلول برمجية متقدمة'
                        ]
                    ],
                    'summary' => 'مهندس برمجيات متخصص مع خبرة في التقنيات الحديثة'
                ]),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ];
        }

        // Technical Companies (9)
        $techCompanies = [
            [
                'name' => 'شركة الحلول البرمجية',
                'email' => 'info@software-solutions.com',
                'password' => Hash::make('password123'),
                'role' => 'company',
                'status' => 'approved',
                'email_verified_at' => Carbon::now(),
                'phone' => '0111111111',
                'city' => 'دمشق',
                'country' => 'سوريا',
                'bio' => json_encode([
                    'company_info' => [
                        'legal_name' => 'شركة الحلول البرمجية ش.م.م',
                        'founded_year' => 2012,
                        'company_size' => '50-100 موظف',
                        'industry' => ['تطوير البرمجيات', 'الحلول المؤسسية'],
                        'website' => 'www.software-solutions.com',
                        'headquarters' => 'دمشق، سوريا'
                    ],
                    'hiring_needs' => [
                        'open_positions' => [
                            [
                                'title' => 'مطور Python',
                                'department' => 'التطوير',
                                'location' => 'دمشق'
                            ],
                            [
                                'title' => 'مهندس DevOps',
                                'department' => 'العمليات',
                                'location' => 'دمشق'
                            ]
                        ],
                        'hiring_process' => ['تقديم الطلب', 'اختبار تقني', 'مقابلة فنية', 'مقابلة نهائية']
                    ],
                    'summary' => 'شركة متخصصة في تطوير الحلول البرمجية للمؤسسات'
                ]),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'شركة الذكاء التقني',
                'email' => 'info@ai-tech.com',
                'password' => Hash::make('password123'),
                'role' => 'company',
                'status' => 'approved',
                'email_verified_at' => Carbon::now(),
                'phone' => '0112222222',
                'city' => 'حلب',
                'country' => 'سوريا',
                'bio' => json_encode([
                    'company_info' => [
                        'legal_name' => 'شركة الذكاء التقني ش.م.م',
                        'founded_year' => 2018,
                        'company_size' => '20-50 موظف',
                        'industry' => ['الذكاء الاصطناعي', 'تعلم الآلة'],
                        'website' => 'www.ai-tech.com',
                        'headquarters' => 'حلب، سوريا'
                    ],
                    'hiring_needs' => [
                        'open_positions' => [
                            [
                                'title' => 'عالم بيانات',
                                'department' => 'البحث والتطوير',
                                'location' => 'حلب'
                            ],
                            [
                                'title' => 'مطور Python',
                                'department' => 'التطوير',
                                'location' => 'حلب'
                            ]
                        ]
                    ],
                    'summary' => 'شركة رائدة في مجال الذكاء الاصطناعي وتعلم الآلة'
                ]),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]
        ];

        // Generate 7 more tech companies
        $techIndustries = [
            ['تطوير البرمجيات', 'الحلول السحابية'],
            ['أمن المعلومات', 'الاختراق الأخلاقي'],
            ['تطوير الألعاب', 'الواقع الافتراضي'],
            ['إنترنت الأشياء', 'التقنيات الذكية'],
            ['بلوك تشين', 'العملات الرقمية'],
            ['البيانات الضخمة', 'تحليل البيانات'],
            ['DevOps', 'الحلول السحابية']
        ];

        for ($i = 2; $i <= 9; $i++) {
            $techCompanies[] = [
                'name' => 'شركة التقنية ' . $i,
                'email' => 'info@tech' . $i . '.com',
                'password' => Hash::make('password123'),
                'role' => 'company',
                'status' => 'approved',
                'email_verified_at' => Carbon::now(),
                'phone' => '011' . rand(1000000, 9999999),
                'city' => ['دمشق', 'حلب', 'حمص', 'اللاذقية'][rand(0, 3)],
                'country' => 'سوريا',
                'bio' => json_encode([
                    'company_info' => [
                        'legal_name' => 'شركة التقنية ' . $i . ' ش.م.م',
                        'founded_year' => rand(2010, 2020),
                        'company_size' => ['10-50 موظف', '50-100 موظف', '100-200 موظف'][rand(0, 2)],
                        'industry' => $techIndustries[$i - 2],
                        'website' => 'www.tech' . $i . '.com',
                        'headquarters' => ['دمشق', 'حلب', 'حمص', 'اللاذقية'][rand(0, 3)] . '، سوريا'
                    ],
                    'hiring_needs' => [
                        'open_positions' => [
                            [
                                'title' => ['مطور ' . $this->programmingLanguages[array_rand($this->programmingLanguages)], 
                                 'مهندس ' . $this->devOpsTools[array_rand($this->devOpsTools)]][rand(0, 1)],
                                'department' => ['التطوير', 'البحث والتطوير', 'العمليات'][rand(0, 2)],
                                'location' => ['دمشق', 'حلب', 'حمص', 'اللاذقية'][rand(0, 3)]
                            ]
                        ]
                    ],
                    'summary' => 'شركة متخصصة في ' . implode(' و ', $techIndustries[$i - 2])
                ]),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ];
        }

        DB::table('users')->insert(array_merge($users, $techCompanies));
    }
}