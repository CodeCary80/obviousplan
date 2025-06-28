<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    /**
     * Send password reset link to user's email
     */
    public function sendResetLinkEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Send reset link
        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'success' => true,
                'message' => 'Password reset link sent to your email!'
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Unable to send reset link. Please try again.'
            ], 500);
        }
    }

    /**
     * Reset the user's password
     */
    public function reset(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'success' => true,
                'message' => 'Password has been reset successfully!'
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired reset token.'
            ], 400);
        }
    }

    /**
     * Validate reset token without resetting password
     * Useful for frontend to check if token is valid before showing reset form
     */
    public function validateToken(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if token is valid
        $user = Password::getUser($request->only('email'));
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid email address.'
            ], 400);
        }

        if (!Password::tokenExists($user, $request->token)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired reset token.'
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'Token is valid.',
            'data' => [
                'email' => $user->email
            ]
        ]);
    }
}