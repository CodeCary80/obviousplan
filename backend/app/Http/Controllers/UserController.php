<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\GeneratedSchedule;
use App\Models\UserFavorite;
use App\Models\UserPlanHistory;

class UserController extends Controller
{
        public function getFavorites(Request $request): JsonResponse
    {
        try {
            $user = auth()->user();
            
            $favorites = UserFavorite::where('user_id', $user->id)
                ->with([
                    'generatedSchedule.restaurant', 
                    'generatedSchedule.activity', 
                    'generatedSchedule.tip',
                    'generatedSchedule.userPlanHistories' => function($query) use ($user) {
                        $query->where('user_id', $user->id);
                    }
                ])
                ->orderBy('created_at', 'desc')
                ->get();

            $formattedFavorites = $favorites->map(function ($favorite) {
                $schedule = $favorite->generatedSchedule;
                $history = $schedule->userPlanHistories->first(); 
                
                return [
                    'id' => $favorite->id,
                    'schedule_hash' => $schedule->schedule_hash,
                    'restaurant' => $schedule->restaurant,
                    'activity' => $schedule->activity,
                    'total_budget' => $schedule->total_estimated_budget,
                    'user_notes' => $favorite->user_notes,
                    'saved_at' => $favorite->created_at->toISOString(),
                    'rating' => $history ? $history->user_rating : null,
                    'comment' => $history ? $history->user_comment : null,
                    'was_completed' => $history ? $history->was_completed : false,
                    'completed_at' => $history && $history->completed_at ? $history->completed_at->toISOString() : null,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => ['favorites' => $formattedFavorites]
            ]);
        } catch (\Exception $e) {
            \Log::error('Get favorites error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to load favorites'
            ], 500);
        }
    }

    public function addToFavorites(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'schedule_id' => 'required' 
            ]);

            $user = auth()->user();
            $scheduleIdentifier = $request->schedule_id;

            // Find the schedule by hash or ID
            $schedule = GeneratedSchedule::where('schedule_hash', $scheduleIdentifier)
                ->orWhere('id', $scheduleIdentifier)
                ->first();

            if (!$schedule) {
                return response()->json([
                    'success' => false,
                    'message' => 'Schedule not found'
                ], 404);
            }

            // Check if already favorited
            $existingFavorite = UserFavorite::where('user_id', $user->id)
                ->where('generated_schedule_id', $schedule->id)
                ->first();

            if ($existingFavorite) {
                return response()->json([
                    'success' => false,
                    'message' => 'Already in favorites'
                ], 409);
            }

            // Add to favorites
            UserFavorite::create([
                'user_id' => $user->id,
                'generated_schedule_id' => $schedule->id,
                'user_notes' => null 
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Added to favorites'
            ]);
        } catch (\Exception $e) {
            \Log::error('Add to favorites error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to add to favorites'
            ], 500);
        }
    }

    public function removeFromFavorites(Request $request, $favoriteId): JsonResponse
    {
        try {
            $user = auth()->user();
            
            $favorite = UserFavorite::where('id', $favoriteId)
                ->where('user_id', $user->id)
                ->first();

            if (!$favorite) {
                return response()->json([
                    'success' => false,
                    'message' => 'Favorite not found'
                ], 404);
            }

            $favorite->delete();

            return response()->json([
                'success' => true,
                'message' => 'Removed from favorites'
            ]);
        } catch (\Exception $e) {
            \Log::error('Remove from favorites error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove from favorites'
            ], 500);
        }
    }

    public function getHistory(Request $request): JsonResponse
    {
        try {
            $user = auth()->user();
            
            // Get user's plan history
            $history = UserPlanHistory::where('user_id', $user->id)
                ->with(['generatedSchedule.restaurant', 'generatedSchedule.activity'])
                ->orderBy('created_at', 'desc')
                ->get();

            $formattedHistory = $history->map(function ($historyItem) {
                $schedule = $historyItem->generatedSchedule;
                return [
                    'id' => $historyItem->id,
                    'schedule_hash' => $schedule->schedule_hash,
                    'restaurant' => $schedule->restaurant,
                    'activity' => $schedule->activity,
                    'total_budget' => $schedule->total_estimated_budget,
                    'rating' => $historyItem->user_rating, 
                    'comment' => $historyItem->user_comment, 
                    'was_completed' => $historyItem->was_completed,
                    'completed_at' => $historyItem->completed_at ? $historyItem->completed_at->toISOString() : null,
                    'created_at' => $historyItem->created_at->toISOString(),
                ];
            });

            return response()->json([
                'success' => true,
                'data' => ['history' => $formattedHistory]
            ]);
        } catch (\Exception $e) {
            \Log::error('Get history error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to load history'
            ], 500);
        }
    }

    public function rateSchedule(Request $request, $scheduleId): JsonResponse
    {
        try {
            $request->validate([
                'rating' => 'required|integer|min:1|max:5',
                'comment' => 'nullable|string|max:1000'
            ]);

            $user = auth()->user();

            // Find schedule by hash or ID
            $schedule = GeneratedSchedule::where('schedule_hash', $scheduleId)
                ->orWhere('id', $scheduleId)
                ->first();

            if (!$schedule) {
                return response()->json([
                    'success' => false,
                    'message' => 'Schedule not found'
                ], 404);
            }

            // Create or update history entry
            UserPlanHistory::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'generated_schedule_id' => $schedule->id
                ],
                [
                    'user_rating' => $request->rating, 
                    'user_comment' => $request->comment, 
                    'was_completed' => true, 
                    'completed_at' => now()
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Rating saved successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Rate schedule error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to save rating'
            ], 500);
        }
    }
}