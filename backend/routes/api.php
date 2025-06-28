<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EveningPlanController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Admin\RestaurantController as AdminRestaurantController;
use App\Http\Controllers\Admin\ActivityController as AdminActivityController;
use App\Http\Controllers\Admin\TipController as AdminTipController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Auth\PasswordResetController;
use Illuminate\Support\Facades\Storage;



// Public routes - NO authentication required
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/password/email', [PasswordResetController::class, 'sendResetLinkEmail']);
Route::post('/password/reset', [PasswordResetController::class, 'reset']);
Route::post('/password/validate-token', [PasswordResetController::class, 'validateToken']);

// Evening plan routes - ACCESSIBLE TO EVERYONE (no auth required)
Route::post('/evening-plans', [EveningPlanController::class, 'generatePlan']);
Route::get('/evening-plans/{hash}', [EveningPlanController::class, 'getSchedule']);
Route::post('/evening-plans/{hash}/shuffle-restaurant', [EveningPlanController::class, 'shuffleRestaurant']);
Route::post('/evening-plans/{hash}/shuffle-activity', [EveningPlanController::class, 'shuffleActivity']);
Route::post('/evening-plans/{hash}/confirm', [EveningPlanController::class, 'confirmSchedule']);

// Protected routes - REQUIRES authentication
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // User routes - for saving favorites and viewing history
    Route::prefix('user')->group(function () {
        Route::get('/favorites', [UserController::class, 'getFavorites']);
        Route::post('/favorites', [UserController::class, 'addToFavorites']);
        Route::delete('/favorites/{scheduleId}', [UserController::class, 'removeFromFavorites']);
        Route::get('/history', [UserController::class, 'getHistory']);
        Route::post('/history/{scheduleId}/rate', [UserController::class, 'rateSchedule']);
    });
    
    // Admin routes - ALREADY protected by auth:sanctum above
    Route::prefix('admin')->group(function () {
        Route::apiResource('restaurants', AdminRestaurantController::class);
        Route::apiResource('activities', AdminActivityController::class);
        Route::apiResource('tips', AdminTipController::class);
        Route::apiResource('users', AdminUserController::class);

        Route::post('restaurants/{restaurant}/upload-image', [AdminRestaurantController::class, 'uploadImage']);
        Route::delete('restaurants/{restaurant}/delete-image', [AdminRestaurantController::class, 'deleteImage']);
        Route::post('activities/{activity}/upload-image', [AdminActivityController::class, 'uploadImage']);
        Route::delete('activities/{activity}/delete-image', [AdminActivityController::class, 'deleteImage']);
    });
});
    