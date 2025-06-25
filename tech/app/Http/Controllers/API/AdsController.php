<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Ads;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

use Illuminate\Support\Facades\App;


class AdsController extends Controller
{
     use AuthorizesRequests;
     /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ads = Ads::all();
            
        return response()->json([
            'success' => true,
            'data' => $ads
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $locale = $request->header('Accept-Language');

        if (in_array($locale, ['ar', 'en'])) {
            App::setLocale($locale);
        }

        $validator = Validator::make($request->all(), [
            'FullName' => 'required|string|max:255',
            'location' => 'nullable|string',
            'image' => 'required|image|max:4096', 
            'ad_Url' => 'required|url',
            'start_date' => 'required|date',
            'End_date' => 'required|date|after:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => __('validation.failed'),
                'errors' => $validator->errors()
            ], 422);
        }
        
        $imagePath = null;
        
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('ads', 'public');
        }
        
         $ads = Ads::create([
            'FullName' => $request->FullName,
            'hit' => 0,
            'Image' => $imagePath,
            'ad_Url' => $request->ad_Url,
            'start_date' => $request->start_date,
            'End_date' => $request->End_date,
            'location' => $request->location,
        ]);
        
        return response()->json($ads, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Ads $ad)
    {
        $ad->get();
        
        return response()->json($ad);
    }

    public function update(Request $request, $id)
    {
         $ad = Ads::findOrFail($id);

        $validator = Validator::make($request->all(),[
            'FullName' => 'nullable|string|max:255',
            'location' => 'nullable|string',
            'image' => 'nullable|image|max:2048', // 2MB max
            'url' => 'nullable|url',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',            
            'hit' => 'nullable|integer',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->only([
            'FullName',
            'location',
            'status',
            'url',
            'hit',
            'start_date',
            'end_date'
        ]);

        $imagePath = $ad->image_path;
        
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($ad->image_path) {
                Storage::disk('public')->delete($ad->image_path);
            }
            
            $data['Image']  = $request->file('image')->store('ads', 'public');
        }
        
        $ad->update($data);
        
        return response()->json($ad);
    }

    public function destroy( $id)
    {
        $ad = Ads::findOrFail($id);

        if ($ad->image_path) {
            Storage::disk('public')->delete($ad->image_path);
        }
        
        $ad->delete();
        
        return response()->json(['message' => 'Ad deleted'], 200);
    }
}
