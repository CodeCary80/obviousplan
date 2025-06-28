<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\PlanRequest;
use App\Models\GeneratedSchedule;
use App\Services\PlanGenerationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

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
            'budget_preference' => 'required|in:$,$$,$$$,$$$$,$$$$$',
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

            // Load relationships
            $schedule->load(['restaurant', 'activity', 'tip', 'planRequest']);

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
                        'location_based' => true, // Your debug value
                        'debug_test' => 'CONTROLLER_UPDATED',
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Plan generation failed: ' . $e->getMessage());
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
                    'location_based' => $schedule->planRequest->location_shared && $schedule->planRequest->user_latitude && $schedule->planRequest->user_longitude,
                ]
            ]
        ]);
    }

    /**
     * Shuffle restaurant in existing plan - FIXED VERSION
     */
    public function shuffleRestaurant(Request $request, $hash)
    {
        try {
            $schedule = GeneratedSchedule::with(['planRequest'])
                ->where('schedule_hash', $hash)
                ->first();

            if (!$schedule) {
                return response()->json([
                    'success' => false,
                    'message' => 'Schedule not found'
                ], 404);
            }

            Log::info('Shuffling restaurant for schedule: ' . $schedule->id);

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

            // Update the schedule with new restaurant
            $schedule->restaurant_id = $newRestaurant->id;
            $schedule->save();

            // Reload the restaurant relationship
            $schedule->load('restaurant');

            Log::info('Restaurant shuffled successfully to: ' . $newRestaurant->name);

            return response()->json([
                'success' => true,
                'message' => 'Restaurant shuffled successfully',
                'data' => [
                    'restaurant' => $schedule->restaurant
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Restaurant shuffle failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to shuffle restaurant: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Shuffle activity in existing plan - FIXED VERSION
     */
    public function shuffleActivity(Request $request, $hash)
    {
        try {
            $schedule = GeneratedSchedule::with(['planRequest'])
                ->where('schedule_hash', $hash)
                ->first();

            if (!$schedule) {
                return response()->json([
                    'success' => false,
                    'message' => 'Schedule not found'
                ], 404);
            }

            Log::info('Shuffling activity for schedule: ' . $schedule->id);

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

            // Update the schedule with new activity
            $schedule->activity_id = $newActivity->id;
            $schedule->save();

            // Reload the activity relationship
            $schedule->load('activity');

            Log::info('Activity shuffled successfully to: ' . $newActivity->activity_title);

            return response()->json([
                'success' => true,
                'message' => 'Activity shuffled successfully',
                'data' => [
                    'activity' => $schedule->activity
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Activity shuffle failed: ' . $e->getMessage());
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
        try {
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

        } catch (\Exception $e) {
            Log::error('Schedule confirmation failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to confirm schedule'
            ], 500);
        }
    }
}