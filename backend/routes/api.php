<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Public\EveningPlanController;

// Test route
Route::get('/test', function () {
    return response()->json([
        'success' => true,
        'message' => 'API is working!',
        'timestamp' => now()
    ]);
});

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Evening plan routes (core functionality)
Route::post('/evening-plans', [EveningPlanController::class, 'generatePlan']);
Route::get('/evening-plans/{hash}', [EveningPlanController::class, 'getSchedule']);
Route::post('/evening-plans/{hash}/shuffle-restaurant', [EveningPlanController::class, 'shuffleRestaurant']);
Route::post('/evening-plans/{hash}/shuffle-activity', [EveningPlanController::class, 'shuffleActivity']);
Route::post('/evening-plans/{hash}/confirm', [EveningPlanController::class, 'confirmSchedule']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});