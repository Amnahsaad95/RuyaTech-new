<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{

    /**
     * Get the authenticated user's profile
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function show()
    {
        $user = Auth::user();
        return response()->json($user);
    }

    /**
     * Update the authenticated user's profile
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request,$id)
    {
     
       //return response()->json($request->hasFile('cv_path'));
        $user = User::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email',
            'password' => 'nullable|string|min:6|confirmed',
            'phone' => 'nullable|string|max:20',
            'profile_image' => 'nullable|image|max:4096',
            'bio' => 'nullable|json', // تأكد أنه json قابل للتحليل
            'cv_path' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            'role' => 'nullable|in:professional,student,company,admin',            
            'status' => 'nullable|in:approved,suspended,rejected,pending',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'National' => 'nullable|string|max:100',
            'SocialProfile' => 'nullable|string|max:255',
            'mainfield' => 'nullable|string|max:255',
            'isexpert' => 'nullable|boolean',
            'isjobseek' => 'nullable|boolean',
        ]);

        

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }


        $data = $request->only([
            'name' ,
            'email' ,
            'password' ,
            'phone',
            'bio' , 
            'role',            
            'status' ,
            'city' ,
            'country',
            'National' ,
            'SocialProfile' ,
            'mainfield',  
            'isexpert' ,
            'isjobseek' ,
        ]);

        // معالجة الصورة إذا كانت مرفوعة
        if ($request->hasFile('profile_image')) {
            if ($user->profile_image) {
                Storage::disk('public')->delete($user->profile_image);
            }
            $data['profile_image'] = $request->file('profile_image')->store('users/image', 'public');
        }

        if ($request->hasFile('cv_path')) {
            if ($user->cv_path) {
                Storage::disk('public')->delete($user->cv_path);
            }
            $data['cv_path'] = $request->file('cv_path')->store('users/cvs', 'public');
        }

        if ($request->has('bio')) {
            
            $data['bio'] = $request->bio ? json_decode($request->bio, true) : null;
        }

       // return response()->json($data['cv_path']);
        
        $user->update($data);
        return response()->json($user);
    }
    
    /**
     * Get a specific user's public profile
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserProfile($id)
    {
        $user = User::findOrFail($id);
        
        // Return only public information
        return response()->json($user);
    }
    
    /**
     * Search for users by various criteria
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function search(Request $request)
    {
        $query = User::query();
        
        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }
        
        // Filter by role
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }
        
        // Filter by skills (for JSON fields)
        if ($request->has('skills')) {
            $skills = $request->skills;
            if (is_string($skills)) {
                $skills = explode(',', $skills);
            }
            
            foreach ($skills as $skill) {
                $query->whereJsonContains('skills', trim($skill));
            }
        }
        
        // Filter by industry
        if ($request->has('industry')) {
            $query->where('industry', 'like', '%' . $request->industry . '%');
        }
        
        // Filter by location
        if ($request->has('location')) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }
        
        // Paginate results
        $users = $query->paginate(15);
        
        return response()->json($users);
    }

    public function showSetting()
    {
        $setting = Setting::first(); // Assuming only one row
        return response()->json($setting);
    }

    public function updateSetting(Request $request)
    {
        
        $setting = Setting::first();
   
        if (!$setting) {
            return response()->json(['message' => 'Settings not found.'], 404);
        }

        $validator  = Validator::make($request->all(),[
            'site_name'       => 'nullable|string|max:255',
            'sitemail'        => 'nullable|email',
            'facebook_url'    => 'nullable|url',
            'instagram_url'   => 'nullable|url',
            'whatsapp_number' => 'nullable|string',
            'intro_title_1'   => 'nullable|string',
            'intro_text_1'    => 'nullable|string',
            'intro_title_2'   => 'nullable|string',
            'intro_text_2'    => 'nullable|string',
            'intro_title_3'   => 'nullable|string',
            'intro_text_3'    => 'nullable|string',
            'site_location'   => 'nullable|string',
            'siteDescription' => 'nullable|string',
            'siteDescriptionAr' => 'nullable|string',
            
            // صور كـ ملفات
            'site_icon'       => 'nullable|image|mimes:jpg,jpeg,png,svg|max:2048',
            'site_logo'       => 'nullable|image|mimes:jpg,jpeg,png,svg|max:2048',
            'intro_image_1'   => 'nullable|image|mimes:jpg,jpeg,png,svg|max:2048',
            'intro_image_2'   => 'nullable|image|mimes:jpg,jpeg,png,svg|max:2048',
            'intro_image_3'   => 'nullable|image|mimes:jpg,jpeg,png,svg|max:2048',
        ]);
        if ($validator ->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator ->errors(),
            ], 422);
        }        

        $data = $request->only([
            'site_name',
            'sitemail',
            'facebook_url',
            'instagram_url',
            'whatsapp_number',
            'intro_title_1',
            'intro_text_1',
            'intro_title_2',
            'intro_text_2',
            'intro_title_3',
            'intro_text_3',
            'site_location',
            'siteDescription',
            
            'siteDescriptionAr'
        ]);
        // قائمة الصور
        $imageFields = ['site_icon', 'site_logo', 'intro_image_1', 'intro_image_2', 'intro_image_3'];

        foreach ($imageFields as $field) {
            if ($request->hasFile($field)) {
                // حذف الصورة القديمة إن وجدت
                if ($setting->$field && Storage::disk('public')->exists($setting->$field)) {
                    Storage::disk('public')->delete($setting->$field);
                }

                // رفع الصورة الجديدة
                $path = $request->file($field)->store('settings', 'public');
                $data[$field] = $path;
            }
        }

        $setting->update($data);

        return response()->json([
            'message' => 'Settings updated successfully.',
            'data' => $setting
        ]);
    }
}
