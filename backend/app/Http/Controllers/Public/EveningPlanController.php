<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\PlanRequest;
use App\Models\GeneratedSchedule;
use App\Services\PlanGenerationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EveningPlanController extends Controller
{
    protected $planGenerationService;

    public function __construct(PlanGenerationService $planGenerationService)
    {
        $this->planGenerationService = $planGenerationService;
    }

    /**
     * Generate a new evening plan
     */
    public function generatePlan(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'energy_level' => 'required|in:Low,Medium,High',
            'budget_preference' => 'required|in:$,$$,$$$',
            'company_type' => 'required|in:Solo,Date,Small Group,Large Group',
            'user_latitude' => 'nullable|numeric|between:-90,90',
            'user_longitude' => 'nullable|numeric|between:-180,180',
            'location_shared' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Create plan request
            $planRequest = PlanRequest::create([
                'user_id' => $request->user()?->id,
                'energy_level' => $request->energy_level,
                'budget_preference' => $request->budget_preference,
                'company_type' => $request->company_type,
                'user_latitude' => $request->user_latitude,
                'user_longitude' => $request->user_longitude,
                'location_shared' => $request->location_shared ?? false,
                'session_id' => $request->user() ? null : session()->getId(),
            ]);

            // Generate the schedule
            $schedule = $this->planGenerationService->generateSchedule($planRequest);

            return response()->json([
                'success' => true,
                'message' => 'Plan generated successfully',
                'data' => [
                    'schedule' => [
                        'id' => $schedule->id,
                        'hash' => $schedule->schedule_hash,
                        'restaurant' => $schedule->restaurant,
                        'activity' => $schedule->activity,
                        'tip' => $schedule->tip,
                        'total_estimated_budget' => $schedule->total_estimated_budget,
                        'location_based' => $planRequest->hasLocation(),
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate plan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get schedule by hash
     */
    public function getSchedule($hash)
    {
        $schedule = GeneratedSchedule::with(['restaurant', 'activity', 'tip', 'planRequest'])
            ->where('schedule_hash', $hash)
            ->first();

        if (!$schedule) {
            return response()->json([
                'success' => false,
                'message' => 'Schedule not found'
            ], 404);
        }

        // Mark as viewed
        $schedule->update(['was_viewed' => true]);

        return response()->json([
            'success' => true,
            'data' => [
                'schedule' => [
                    'id' => $schedule->id,
                    'hash' => $schedule->schedule_hash,
                    'restaurant' => $schedule->restaurant,
                    'activity' => $schedule->activity,
                    'tip' => $schedule->tip,
                    'total_estimated_budget' => $schedule->total_estimated_budget,
                    'was_confirmed' => $schedule->was_confirmed,
                    'location_based' => $schedule->planRequest->hasLocation(),
                ]
            ]
        ]);
    }

    /**
     * Shuffle restaurant in existing plan
     */
    public function shuffleRestaurant(Request $request, $hash)
    {
        $schedule = GeneratedSchedule::with(['planRequest'])
            ->where('schedule_hash', $hash)
            ->first();

        if (!$schedule) {
            return response()->json([
                'success' => false,
                'message' => 'Schedule not found'
            ], 404);
        }

        try {
            $newRestaurant = $this->planGenerationService->findAlternativeRestaurant(
                $schedule->planRequest, 
                $schedule->restaurant_id
            );

            if (!$newRestaurant) {
                return response()->json([
                    'success' => false,
                    'message' => 'No alternative restaurant found'
                ], 404);
            }

            $schedule->update(['restaurant_id' => $newRestaurant->id]);
            $schedule->load('restaurant');

            return response()->json([
                'success' => true,
                'message' => 'Restaurant shuffled successfully',
                'data' => [
                    'restaurant' => $schedule->restaurant
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to shuffle restaurant: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Shuffle activity in existing plan
     */
    public function shuffleActivity(Request $request, $hash)
    {
        $schedule = GeneratedSchedule::with(['planRequest'])
            ->where('schedule_hash', $hash)
            ->first();

        if (!$schedule) {
            return response()->json([
                'success' => false,
                'message' => 'Schedule not found'
            ], 404);
        }

        try {
            $newActivity = $this->planGenerationService->findAlternativeActivity(
                $schedule->planRequest, 
                $schedule->activity_id
            );

            if (!$newActivity) {
                return response()->json([
                    'success' => false,
                    'message' => 'No alternative activity found'
                ], 404);
            }

            $schedule->update(['activity_id' => $newActivity->id]);
            $schedule->load('activity');

            return response()->json([
                'success' => true,
                'message' => 'Activity shuffled successfully',
                'data' => [
                    'activity' => $schedule->activity
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to shuffle activity: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Confirm schedule (mark as confirmed)
     */
    public function confirmSchedule(Request $request, $hash)
    {
        $schedule = GeneratedSchedule::where('schedule_hash', $hash)->first();

        if (!$schedule) {
            return response()->json([
                'success' => false,
                'message' => 'Schedule not found'
            ], 404);
        }

        $schedule->update(['was_confirmed' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Schedule confirmed successfully'
        ]);
    }
}