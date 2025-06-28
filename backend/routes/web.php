<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\PasswordResetController;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/password/reset/{token}', function ($token) {
    return view('auth.reset-password', ['token' => $token]);
})->name('password.reset');

Route::get('/password/reset', function () {
    return view('auth.forgot-password');
})->name('password.request');
