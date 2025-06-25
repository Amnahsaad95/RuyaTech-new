<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\App;

use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    /**
     * Register a new user
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'phone' => 'nullable|string|max:20',
            'profile_image' => 'nullable|image|max:4096',
            'bio' => 'nullable|json', // تأكد أنه json قابل للتحليل
            'cv_path' => 'nullable|file|mimes:pdf,doc,docx|max:20480',
            'role' => 'nullable|in:professional,student,company',
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

        $imagePath = null;
        if ($request->hasFile('profile_image')) {
            $imagePath = $request->file('profile_image')->store('users/image', 'public');
        }
        $cvPath = null;
        if ($request->hasFile('cv_path')) {
            $cvPath = $request->file('cv_path')->store('users/cvs', 'public');
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone ?? null,
            'profile_image' => $imagePath,
            'bio' => $request->bio ? json_decode($request->bio, true) : null, // نحتفظ به كـ array
            'cv_path' => $cvPath,
            'role' => $request->role,
            'city' => $request->city,
            'country' => $request->country,
            'National' => $request->National,
            'SocialProfile' => $request->SocialProfile,
            'mainfield' => $request->mainfield,
            'isexpert' => $request->isexpert,
            'isjobseek' => $request->isjobseek,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Rregistrstion successful. Awaitting admin approval',
            ], 201);
    }

    /**
     * Login user and create token
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        $locale = $request->header('Accept-Language');

        if (in_array($locale, ['ar', 'en'])) {
            App::setLocale($locale);
        }

        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => __('validation.failed'),
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid login credentials'
            ], 401);
        }

        if ($user->status === 'pending') {
            return response()->json([
                'status' => 'error',
                'message' => 'Your account is pending approval.',
                'code' => 'EMAIL_NOT_APPROVED'
            ], 403);
        }

        if ($user->status === 'rejected') {
            return response()->json([
                'status' => 'error',
                'message' => 'Your account has been rejected.',
                'code' => 'EMAIL_REJECTED'
            ], 403);
        }

        if ($user->status === 'suspended') {
            return response()->json([
                'status' => 'error',
                'message' => 'Your account is suspended.',
                'code' => 'EMAIL_SUSPENDED'
            ], 403);
        }

        // Revoke all existing tokens
        $user->tokens()->delete();

        // Create new token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Login successful',
            'data' => [
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]
        ]);
    }


    /**
     * Get authenticated user details
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function user(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'data' => [
                'user' => $request->user(),
            ]
        ]);
    }

    /**
     * Logout user (revoke token)
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out'
        ]);
    }

     public function update(Request $request,$id)
    {
     
        return response()->json("hi");
        $user = User::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email',
            'password' => 'nullable|string|min:6|confirmed',
            'phone' => 'nullable|string|max:20',
            'profile_image' => 'nullable|image|max:4096',
            'bio' => 'nullable|json', // تأكد أنه json قابل للتحليل
            'cv_path' => 'nullable|file|mimes:pdf,doc,docx|max:20480',
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
                Storage::disk('public')->delete($user->image_path);
            }
            $data['cv_path'] = $request->file('cv_path')->store('users/cvs', 'public');
        }

        if ($request->has('bio')) {
            
            $data['bio'] = $request->bio ? json_decode($request->bio, true) : null;
        }

        

        $user->update($data);
        return response()->json($user);
    }

    public function sendResetLink(Request $request)
    {
      // return "hiii";
        $validator = Validator::make($request->all(),
            ['email' => 'required|email']
        );

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
        
        $user = User::where('email', $request->email)->first();
        
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        
        // Generate a simple token (you might want to use a more secure method in production)
        $token = Str::random(60);
        
        // Store the token in the user's record
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            ['token' => $token, 'created_at' => now()]
        );
        
        // Instead of sending email, return the token directly
        return response()->json([
            'message' => 'Reset token generated',
            'token' => $token,
            'reset_url' => "/auth/reset-password?token=$token&email={$user->email}"
        ]);
    }

    public function resetPassword(Request $request)
    {
       // return "hiii";
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => 'required|confirmed|min:8',
        ]);

        $data = DB::table('password_reset_tokens')->where('token', $request->token)->first();

        if(!$data) {
            abort(404);
        }
        
        
        $user = User::where('email', $request->email)
                   ->first();
        
        if (!$user) {
            return response()->json(['message' => 'Invalid token or email'], 400);
        }
        
        
        // Update password and clear token
        $user->forceFill([
            'password' => Hash::make($request->password),
        ])->save();
        
        DB::table('password_reset_tokens')->where('token', $request->token)->delete();

        return response()->json(['message' => 'Password has been reset successfully']);
    }

}
