<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage; 

class ActivityController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Activity::query();
        
        // Search functionality
        if ($request->has('search') && $request->search) {
            $query->where('activity_title', 'like', '%' . $request->search . '%')
                  ->orWhere('activity_type', 'like', '%' . $request->search . '%')
                  ->orWhere('venue_name', 'like', '%' . $request->search . '%');
        }
        
        $perPage = $request->get('per_page', 10);
        $activities = $query->orderBy('created_at', 'desc')->paginate($perPage);
        
        return response()->json([
            'success' => true,
            'data' => [
                'activities' => $activities->items(),
                'pagination' => [
                    'current_page' => $activities->currentPage(),
                    'last_page' => $activities->lastPage(),
                    'per_page' => $activities->perPage(),
                    'total' => $activities->total(),
                ]
            ]
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'activity_title' => 'required|string|max:255',
            'activity_type' => 'required|string|max:100',
            'venue_name' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'address' => 'nullable|string|max:500',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'budget_tag' => 'required|in:$,$$,$$$,$$$$,$$$$$',
            'budget_display_text' => 'nullable|string|max:50',
            'energy_tag' => 'required|in:Low,Medium,High',
            'people_tag' => 'required|in:Solo,Date,Small Group,Large Group',
            'people_display_text' => 'nullable|string|max:100',
            'estimated_duration_minutes' => 'nullable|integer|min:1',
            'indoor_outdoor_status' => 'nullable|in:Indoor,Outdoor,Both',
            'required_materials' => 'nullable|string|max:500',
            'website_url' => 'nullable|url|max:500',
            'booking_url' => 'nullable|url|max:500',
            'curated_image_url' => 'nullable|url|max:500',
        ]);

        $activity = Activity::create($validatedData);

        return response()->json([
            'success' => true,
            'data' => ['activity' => $activity],
            'message' => 'Activity created successfully'
        ], 201);
    }

    public function show(Activity $activity): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => ['activity' => $activity]
        ]);
    }

    public function update(Request $request, Activity $activity): JsonResponse
    {
        $validatedData = $request->validate([
            'activity_title' => 'required|string|max:255',
            'activity_type' => 'required|string|max:100',
            'venue_name' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'address' => 'nullable|string|max:500',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'budget_tag' => 'required|in:$,$$,$$$,$$$$,$$$$$',
            'budget_display_text' => 'nullable|string|max:50',
            'energy_tag' => 'required|in:Low,Medium,High',
            'people_tag' => 'required|in:Solo,Date,Small Group,Large Group',
            'people_display_text' => 'nullable|string|max:100',
            'estimated_duration_minutes' => 'nullable|integer|min:1',
            'indoor_outdoor_status' => 'nullable|in:Indoor,Outdoor,Both',
            'required_materials' => 'nullable|string|max:500',
            'website_url' => 'nullable|url|max:500',
            'booking_url' => 'nullable|url|max:500',
            'curated_image_url' => 'nullable|url|max:500',
        ]);

        $activity->update($validatedData);

        return response()->json([
            'success' => true,
            'data' => ['activity' => $activity],
            'message' => 'Activity updated successfully'
        ]);
    }

    public function destroy(Activity $activity): JsonResponse
    {
        $activity->delete();

        return response()->json([
            'success' => true,
            'message' => 'Activity deleted successfully'
        ]);
    }
    public function uploadImage(Request $request, Activity $activity)
{
    try {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120' // 5MB max
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($activity->curated_image_url) {
                $oldImagePath = str_replace('/storage/', 'public/', parse_url($activity->curated_image_url, PHP_URL_PATH));
                if (Storage::exists($oldImagePath)) {
                    Storage::delete($oldImagePath);
                }
            }

            $image = $request->file('image');
            $filename = 'activity_' . $activity->id . '_' . time() . '.' . $image->getClientOriginalExtension();
            $path = $image->storeAs('public/activities', $filename);
            
            $activity->update([
                'curated_image_url' => Storage::url($path)
            ]);

            return response()->json([
                'success' => true,
                'data' => ['image_url' => $activity->curated_image_url],
                'message' => 'Activity image uploaded successfully'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'No image file provided'
        ], 400);

    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $e->errors()
        ], 422);
    } catch (\Exception $e) {
        \Log::error('Activity image upload error: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Failed to upload image: ' . $e->getMessage()
        ], 500);
    }
}

public function deleteImage(Activity $activity)
{
    try {
        if ($activity->curated_image_url) {
            $oldImagePath = str_replace('/storage/', 'public/', parse_url($activity->curated_image_url, PHP_URL_PATH));
            if (Storage::exists($oldImagePath)) {
                Storage::delete($oldImagePath);
            }

            $activity->update(['curated_image_url' => null]);

            return response()->json([
                'success' => true,
                'message' => 'Activity image deleted successfully'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'No image to delete'
        ], 400);

    } catch (\Exception $e) {
        \Log::error('Activity image delete error: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Failed to delete image'
        ], 500);
    }
}
}
