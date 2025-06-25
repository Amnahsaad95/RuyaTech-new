<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted' => 'يجب قبول :attribute',
    'accepted_if' => 'يجب قبول :attribute عندما يكون :other يساوي :value',
    'active_url' => ':attribute ليس عنوان URL صالح',
    'after' => 'يجب أن يكون :attribute تاريخًا بعد :date',
    'after_or_equal' => 'يجب أن يكون :attribute تاريخًا بعد أو يساوي :date',
    'alpha' => 'يجب أن يحتوي :attribute على أحرف فقط',
    'alpha_dash' => 'يجب أن يحتوي :attribute على أحرف وأرقام وشرطات فقط',
    'alpha_num' => 'يجب أن يحتوي :attribute على أحرف وأرقام فقط',
    'any_of' => ':attribute غير صالح',
    'array' => 'يجب أن يكون :attribute مصفوفة',
    'ascii' => 'يجب أن يحتوي :attribute على أحرف أبجدية رقمية ذات بايت واحد ورموز فقط',
    'before' => 'يجب أن يكون :attribute تاريخًا قبل :date',
    'before_or_equal' => 'يجب أن يكون :attribute تاريخًا قبل أو يساوي :date',
    'between' => [
        'array' => 'يجب أن يحتوي :attribute على عدد عناصر بين :min و :max',
        'file' => 'يجب أن يكون حجم :attribute بين :min و :max كيلوبايت',
        'numeric' => 'يجب أن تكون قيمة :attribute بين :min و :max',
        'string' => 'يجب أن يكون طول :attribute بين :min و :max أحرف',
    ],
    'boolean' => 'يجب أن تكون قيمة :attribute صحيحة أو خاطئة',
    'can' => 'يحتوي :attribute على قيمة غير مصرح بها',
    'confirmed' => 'تأكيد :attribute غير متطابق',
    'contains' => 'يحتوي :attribute على قيمة مطلوبة مفقودة',
    'current_password' => 'كلمة المرور غير صحيحة',
    'date' => ':attribute ليس تاريخًا صالحًا',
    'date_equals' => 'يجب أن يكون :attribute تاريخًا يساوي :date',
    'date_format' => 'لا يتطابق :attribute مع الصيغة :format',
    'decimal' => 'يجب أن يحتوي :attribute على :decimal منازل عشرية',
    'declined' => 'يجب رفض :attribute',
    'declined_if' => 'يجب رفض :attribute عندما يكون :other يساوي :value',
    'different' => 'يجب أن يكون :attribute و :other مختلفين',
    'digits' => 'يجب أن يحتوي :attribute على :digits أرقام',
    'digits_between' => 'يجب أن يحتوي :attribute على عدد أرقام بين :min و :max',
    'dimensions' => 'أبعاد صورة :attribute غير صالحة',
    'distinct' => 'يحتوي :attribute على قيمة مكررة',
    'doesnt_end_with' => 'يجب ألا ينتهي :attribute بأحد القيم التالية: :values',
    'doesnt_start_with' => 'يجب ألا يبدأ :attribute بأحد القيم التالية: :values',
    'email' => 'يجب أن يكون :attribute عنوان بريد إلكتروني صالح',
    'ends_with' => 'يجب أن ينتهي :attribute بأحد القيم التالية: :values',
    'enum' => ':attribute المحدد غير صالح',
    'exists' => ':attribute المحدد غير صالح',
    'extensions' => 'يجب أن يحتوي :attribute على أحد الامتدادات التالية: :values',
    'file' => 'يجب أن يكون :attribute ملفًا',
    'filled' => 'يجب أن يحتوي :attribute على قيمة',
    'gt' => [
        'array' => 'يجب أن يحتوي :attribute على أكثر من :value عنصر',
        'file' => 'يجب أن يكون حجم :attribute أكبر من :value كيلوبايت',
        'numeric' => 'يجب أن تكون قيمة :attribute أكبر من :value',
        'string' => 'يجب أن يكون طول :attribute أكبر من :value أحرف',
    ],
    'gte' => [
        'array' => 'يجب أن يحتوي :attribute على :value عنصر أو أكثر',
        'file' => 'يجب أن يكون حجم :attribute أكبر من أو يساوي :value كيلوبايت',
        'numeric' => 'يجب أن تكون قيمة :attribute أكبر من أو تساوي :value',
        'string' => 'يجب أن يكون طول :attribute أكبر من أو يساوي :value أحرف',
    ],
    'hex_color' => 'يجب أن يكون :attribute لونًا سداسيًا صالحًا',
    'image' => 'يجب أن يكون :attribute صورة',
    'in' => ':attribute المحدد غير صالح',
    'in_array' => 'يجب أن يوجد :attribute في :other',
    'integer' => 'يجب أن يكون :attribute عددًا صحيحًا',
    'ip' => 'يجب أن يكون :attribute عنوان IP صالح',
    'ipv4' => 'يجب أن يكون :attribute عنوان IPv4 صالح',
    'ipv6' => 'يجب أن يكون :attribute عنوان IPv6 صالح',
    'json' => 'يجب أن يكون :attribute نص JSON صالح',
    'list' => 'يجب أن يكون :attribute قائمة',
    'lowercase' => 'يجب أن يكون :attribute بأحرف صغيرة',
    'lt' => [
        'array' => 'يجب أن يحتوي :attribute على أقل من :value عنصر',
        'file' => 'يجب أن يكون حجم :attribute أقل من :value كيلوبايت',
        'numeric' => 'يجب أن تكون قيمة :attribute أقل من :value',
        'string' => 'يجب أن يكون طول :attribute أقل من :value أحرف',
    ],
    'lte' => [
        'array' => 'يجب ألا يحتوي :attribute على أكثر من :value عنصر',
        'file' => 'يجب أن يكون حجم :attribute أقل من أو يساوي :value كيلوبايت',
        'numeric' => 'يجب أن تكون قيمة :attribute أقل من أو تساوي :value',
        'string' => 'يجب أن يكون طول :attribute أقل من أو يساوي :value أحرف',
    ],
    'mac_address' => 'يجب أن يكون :attribute عنوان MAC صالح',
    'max' => [
        'array' => 'يجب ألا يحتوي :attribute على أكثر من :max عنصر',
        'file' => 'يجب ألا يتجاوز حجم :attribute :max كيلوبايت',
        'numeric' => 'يجب ألا تتجاوز قيمة :attribute :max',
        'string' => 'يجب ألا يتجاوز طول :attribute :max أحرف',
    ],
    'max_digits' => 'يجب ألا يحتوي :attribute على أكثر من :max أرقام',
    'mimes' => 'يجب أن يكون :attribute ملفًا من نوع: :values',
    'mimetypes' => 'يجب أن يكون :attribute ملفًا من نوع: :values',
    'min' => [
        'array' => 'يجب أن يحتوي :attribute على الأقل على :min عنصر',
        'file' => 'يجب أن يكون حجم :attribute على الأقل :min كيلوبايت',
        'numeric' => 'يجب أن تكون قيمة :attribute على الأقل :min',
        'string' => 'يجب أن يكون طول :attribute على الأقل :min أحرف',
    ],
    'min_digits' => 'يجب أن يحتوي :attribute على الأقل على :min أرقام',
    'missing' => 'يجب أن يكون :attribute مفقودًا',
    'missing_if' => 'يجب أن يكون :attribute مفقودًا عندما يكون :other يساوي :value',
    'missing_unless' => 'يجب أن يكون :attribute مفقودًا ما لم يكن :other يساوي :value',
    'missing_with' => 'يجب أن يكون :attribute مفقودًا عندما يكون :values موجودًا',
    'missing_with_all' => 'يجب أن يكون :attribute مفقودًا عندما تكون :values موجودة',
    'multiple_of' => 'يجب أن تكون قيمة :attribute مضاعفًا لـ :value',
    'not_in' => ':attribute المحدد غير صالح',
    'not_regex' => 'صيغة :attribute غير صالحة',
    'numeric' => 'يجب أن يكون :attribute رقمًا',
    'password' => [
        'letters' => 'يجب أن يحتوي :attribute على حرف واحد على الأقل',
        'mixed' => 'يجب أن يحتوي :attribute على حرف كبير وحرف صغير على الأقل',
        'numbers' => 'يجب أن يحتوي :attribute على رقم واحد على الأقل',
        'symbols' => 'يجب أن يحتوي :attribute على رمز واحد على الأقل',
        'uncompromised' => 'ظهر :attribute المحدد في تسريب بيانات. يرجى اختيار :attribute مختلف',
    ],
    'present' => 'يجب أن يكون :attribute موجودًا',
    'present_if' => 'يجب أن يكون :attribute موجودًا عندما يكون :other يساوي :value',
    'present_unless' => 'يجب أن يكون :attribute موجودًا ما لم يكن :other يساوي :value',
    'present_with' => 'يجب أن يكون :attribute موجودًا عندما يكون :values موجودًا',
    'present_with_all' => 'يجب أن يكون :attribute موجودًا عندما تكون :values موجودة',
    'prohibited' => ':attribute محظور',
    'prohibited_if' => ':attribute محظور عندما يكون :other يساوي :value',
    'prohibited_if_accepted' => ':attribute محظور عندما يتم قبول :other',
    'prohibited_if_declined' => ':attribute محظور عندما يتم رفض :other',
    'prohibited_unless' => ':attribute محظور ما لم يكن :other ضمن :values',
    'prohibits' => ':attribute يحظر وجود :other',
    'regex' => 'صيغة :attribute غير صالحة',
    'required' => 'حقل :attribute مطلوب',
    'required_array_keys' => 'يجب أن يحتوي :attribute على إدخالات لـ: :values',
    'required_if' => 'حقل :attribute مطلوب عندما يكون :other يساوي :value',
    'required_if_accepted' => 'حقل :attribute مطلوب عندما يتم قبول :other',
    'required_if_declined' => 'حقل :attribute مطلوب عندما يتم رفض :other',
    'required_unless' => 'حقل :attribute مطلوب ما لم يكن :other ضمن :values',
    'required_with' => 'حقل :attribute مطلوب عندما يكون :values موجودًا',
    'required_with_all' => 'حقل :attribute مطلوب عندما تكون :values موجودة',
    'required_without' => 'حقل :attribute مطلوب عندما لا يكون :values موجودًا',
    'required_without_all' => 'حقل :attribute مطلوب عندما لا تكون أي من :values موجودة',
    'same' => 'يجب أن يتطابق :attribute مع :other',
    'size' => [
        'array' => 'يجب أن يحتوي :attribute على :size عنصر',
        'file' => 'يجب أن يكون حجم :attribute :size كيلوبايت',
        'numeric' => 'يجب أن تكون قيمة :attribute :size',
        'string' => 'يجب أن يكون طول :attribute :size أحرف',
    ],
    'starts_with' => 'يجب أن يبدأ :attribute بأحد القيم التالية: :values',
    'string' => 'يجب أن يكون :attribute نصًا',
    'timezone' => 'يجب أن يكون :attribute منطقة زمنية صالحة',
    'unique' => 'تم استخدام :attribute مسبقًا',
    'uploaded' => 'فشل تحميل :attribute',
    'uppercase' => 'يجب أن يكون :attribute بأحرف كبيرة',
    'url' => 'يجب أن يكون :attribute عنوان URL صالح',
    'ulid' => 'يجب أن يكون :attribute ULID صالح',
    'uuid' => 'يجب أن يكون :attribute UUID صالح',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'رسالة مخصصة',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [
        'FullName' => 'الاسم الكامل',
        'ad_Url' => 'رابط الإعلان',
        'location' => 'الموقع',
        'start_date' => 'تاريخ البداية',
        'End_date' => 'تاريخ النهاية',
        'image' => 'الصورة',
        'user_id' => 'المستخدم',
        'title' => 'العنوان',
        'content' => 'المحتوى',
        'image_path' => 'الصورة',
        'parent_id' => 'المشاركة الأصلية',
        'status' => 'الحالة',
        'hit' => 'عدد المشاهدات',
        'like' => 'الإعجابات',

        'site_name' => 'اسم الموقع',
        'site_icon' => 'أيقونة الموقع',
        'site_logo' => 'شعار الموقع',
        'sitemail' => 'البريد الإلكتروني للموقع',
        'facebook_url' => 'رابط فيسبوك',
        'instagram_url' => 'رابط إنستغرام',
        'whatsapp_number' => 'رقم واتساب',

        'intro_image_1' => 'الصورة التقديمية الأولى',
        'intro_image_2' => 'الصورة التقديمية الثانية',
        'intro_image_3' => 'الصورة التقديمية الثالثة',

        'intro_title_1' => 'عنوان المقدمة الأولى',
        'intro_text_1' => 'نص المقدمة الأولى',
        'intro_title_2' => 'عنوان المقدمة الثانية',
        'intro_text_2' => 'نص المقدمة الثانية',
        'intro_title_3' => 'عنوان المقدمة الثالثة',
        'intro_text_3' => 'نص المقدمة الثالثة',

        'intro_title_1_Ar' => 'عنوان المقدمة الأولى (عربي)',
        'intro_text_1_Ar' => 'نص المقدمة الأولى (عربي)',
        'intro_title_2_Ar' => 'عنوان المقدمة الثانية (عربي)',
        'intro_text_2_Ar' => 'نص المقدمة الثانية (عربي)',
        'intro_title_3_Ar' => 'عنوان المقدمة الثالثة (عربي)',
        'intro_text_3_Ar' => 'نص المقدمة الثالثة (عربي)',

        'site_location' => 'موقع الشركة',
        'siteDescription' => 'وصف الموقع',
        'siteDescriptionAr' => 'وصف الموقع (عربي)',
        'name' => 'الاسم',
        'email' => 'البريد الإلكتروني',
        'password' => 'كلمة المرور',
        'phone' => 'رقم الهاتف',
        'role' => 'الدور',
        'bio' => 'نبذة عن المستخدم',
        'profile_image' => 'صورة الملف الشخصي',
        'cv_path' => 'السيرة الذاتية',
        'city' => 'المدينة',
        'country' => 'الدولة',
        'National' => 'الجنسية',
        'SocialProfile' => 'الملف الاجتماعي',
        'mainfield' => 'المجال الرئيسي',
        'isexpert' => 'خبير',
        'isjobseek' => 'باحث عن عمل',
        'status' => 'الحالة',
    ],

];