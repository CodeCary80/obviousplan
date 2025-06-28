<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage; 

class RestaurantController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Restaurant::query();
            
            // Search functionality - ENHANCED
            if ($request->has('search') && $request->search) {
                $searchTerm = $request->search;
                $query->where(function($q) use ($searchTerm) {
                    $q->where('name', 'like', '%' . $searchTerm . '%')
                      ->orWhere('cuisine_type', 'like', '%' . $searchTerm . '%')
                      ->orWhere('address', 'like', '%' . $searchTerm . '%')
                      ->orWhere('description_snippet', 'like', '%' . $searchTerm . '%');
                });
            }
            
            // Filter by budget if provided
            if ($request->has('budget_tag') && $request->budget_tag) {
                $query->where('budget_tag', $request->budget_tag);
            }
            
            // Filter by energy if provided
            if ($request->has('energy_tag') && $request->energy_tag) {
                $query->where('energy_tag', $request->energy_tag);
            }
            
            // Filter by people tag if provided
            if ($request->has('people_tag') && $request->people_tag) {
                $query->where('people_tag', $request->people_tag);
            }
            
            // Filter by location status
            if ($request->has('has_location')) {
                if ($request->has_location === 'true') {
                    $query->whereNotNull('latitude')->whereNotNull('longitude');
                } else {
                    $query->where(function($q) {
                        $q->whereNull('latitude')->orWhereNull('longitude');
                    });
                }
            }
            
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            
            $allowedSortFields = ['name', 'cuisine_type', 'budget_tag', 'energy_tag', 'created_at'];
            if (in_array($sortBy, $allowedSortFields)) {
                $query->orderBy($sortBy, $sortOrder);
            } else {
                $query->orderBy('created_at', 'desc');
            }
            
            // Pagination
            $perPage = $request->get('per_page', 10);
            $perPage = min($perPage, 100); // Max 100 items per page
            
            $restaurants = $query->paginate($perPage);
            
            return response()->json([
                'success' => true,
                'data' => [
                    'restaurants' => $restaurants->items(),
                    'pagination' => [
                        'current_page' => $restaurants->currentPage(),
                        'last_page' => $restaurants->lastPage(),
                        'per_page' => $restaurants->perPage(),
                        'total' => $restaurants->total(),
                        'from' => $restaurants->firstItem(),
                        'to' => $restaurants->lastItem(),
                    ],
                    'filters' => [
                        'search' => $request->search,
                        'budget_tag' => $request->budget_tag,
                        'energy_tag' => $request->energy_tag,
                        'people_tag' => $request->people_tag,
                        'has_location' => $request->has_location,
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Admin restaurants index error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to load restaurants: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'address' => 'required|string|max:500',
                'latitude' => 'nullable|numeric|between:-90,90',
                'longitude' => 'nullable|numeric|between:-180,180',
                'cuisine_type' => 'required|string|max:100',
                'description_snippet' => 'nullable|string|max:1000',
                'budget_tag' => 'required|in:$,$$,$$$,$$$$,$$$$$',
                'budget_display_text' => 'nullable|string|max:50',
                'energy_tag' => 'required|in:Low,Medium,High',
                'people_tag' => 'required|in:Solo,Date,Small Group,Large Group',
                'people_display_text' => 'nullable|string|max:100',
                'ambiance_tags' => 'nullable|string|max:500',
                'website_url' => 'nullable|url|max:500',
                'booking_url' => 'nullable|url|max:500',
                'phone_number' => 'nullable|string|max:20',
                'curated_image_url' => 'nullable|url|max:500',
            ]);

            $restaurant = Restaurant::create($validatedData);

            return response()->json([
                'success' => true,
                'data' => ['restaurant' => $restaurant],
                'message' => 'Restaurant created successfully'
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Admin restaurant store error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create restaurant: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show(Restaurant $restaurant): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => ['restaurant' => $restaurant]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Restaurant not found'
            ], 404);
        }
    }

    public function update(Request $request, Restaurant $restaurant): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'address' => 'required|string|max:500',
                'latitude' => 'nullable|numeric|between:-90,90',
                'longitude' => 'nullable|numeric|between:-180,180',
                'cuisine_type' => 'required|string|max:100',
                'description_snippet' => 'nullable|string|max:1000',
                'budget_tag' => 'required|in:$,$$,$$$,$$$$,$$$$$',
                'budget_display_text' => 'nullable|string|max:50',
                'energy_tag' => 'required|in:Low,Medium,High',
                'people_tag' => 'required|in:Solo,Date,Small Group,Large Group',
                'people_display_text' => 'nullable|string|max:100',
                'ambiance_tags' => 'nullable|string|max:500',
                'website_url' => 'nullable|url|max:500',
                'booking_url' => 'nullable|url|max:500',
                'phone_number' => 'nullable|string|max:20',
                'curated_image_url' => 'nullable|url|max:500',
            ]);

            $restaurant->update($validatedData);

            return response()->json([
                'success' => true,
                'data' => ['restaurant' => $restaurant->fresh()],
                'message' => 'Restaurant updated successfully'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Admin restaurant update error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update restaurant: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Restaurant $restaurant): JsonResponse
    {
        try {
            // Check if restaurant is being used in any generated schedules
            $schedulesCount = $restaurant->generatedSchedules()->count();
            
            if ($schedulesCount > 0) {
                return response()->json([
                    'success' => false,
                    'message' => "Cannot delete restaurant. It is referenced in {$schedulesCount} generated schedule(s)."
                ], 400);
            }

            $restaurant->delete();

            return response()->json([
                'success' => true,
                'message' => 'Restaurant deleted successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Admin restaurant delete error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete restaurant: ' . $e->getMessage()
            ], 500);
        }
    }


    public function getFilterOptions(): JsonResponse
    {
        try {
            $budgetTags = Restaurant::distinct()->pluck('budget_tag')->filter()->sort()->values();
            $energyTags = Restaurant::distinct()->pluck('energy_tag')->filter()->sort()->values();
            $peopleTags = Restaurant::distinct()->pluck('people_tag')->filter()->sort()->values();
            $cuisineTypes = Restaurant::distinct()->pluck('cuisine_type')->filter()->sort()->values();

            return response()->json([
                'success' => true,
                'data' => [
                    'budget_tags' => $budgetTags,
                    'energy_tags' => $energyTags,
                    'people_tags' => $peopleTags,
                    'cuisine_types' => $cuisineTypes,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load filter options'
            ], 500);
        }
    }
    
    public function uploadImage(Request $request, Restaurant $restaurant)
{
    try {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120'
        ]);

        if ($request->hasFile('image')) {
            \Log::info('File upload started for restaurant: ' . $restaurant->id);
            
            // Delete old image if exists
            if ($restaurant->curated_image_url) {
                $oldImagePath = str_replace('/storage/', 'public/', parse_url($restaurant->curated_image_url, PHP_URL_PATH));
                if (Storage::exists($oldImagePath)) {
                    Storage::delete($oldImagePath);
                    \Log::info('Deleted old image: ' . $oldImagePath);
                }
            }

            $image = $request->file('image');
            $extension = $image->getClientOriginalExtension();
            $filename = 'restaurant_' . $restaurant->id . '_' . time() . '.' . $extension;
            
            \Log::info('Attempting to store file: ' . $filename);
            
            $path = $image->storeAs('public/restaurants', $filename);
            
            \Log::info('File stored at path: ' . $path);
            \Log::info('Full storage path: ' . storage_path('app/' . $path));
            
            $url = Storage::url($path);
            \Log::info('Generated URL: ' . $url);
            
            $restaurant->update([
                'curated_image_url' => $url
            ]);

            \Log::info('Database updated with URL: ' . $url);

            return response()->json([
                'success' => true,
                'data' => ['image_url' => $restaurant->curated_image_url],
                'message' => 'Restaurant image uploaded successfully'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'No image file provided'
        ], 400);

    } catch (\Exception $e) {
        \Log::error('Restaurant image upload error: ' . $e->getMessage());
        \Log::error('Stack trace: ' . $e->getTraceAsString());
        return response()->json([
            'success' => false,
            'message' => 'Failed to upload image: ' . $e->getMessage()
        ], 500);
    }
}

public function deleteImage(Restaurant $restaurant)
{
    try {
        if ($restaurant->curated_image_url) {
            $oldImagePath = str_replace('/storage/', 'public/', parse_url($restaurant->curated_image_url, PHP_URL_PATH));
            if (Storage::exists($oldImagePath)) {
                Storage::delete($oldImagePath);
            }

            $restaurant->update(['curated_image_url' => null]);

            return response()->json([
                'success' => true,
                'message' => 'Restaurant image deleted successfully'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'No image to delete'
        ], 400);

    } catch (\Exception $e) {
        \Log::error('Restaurant image delete error: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Failed to delete image'
        ], 500);
    }
}
}