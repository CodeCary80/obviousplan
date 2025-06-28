<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $query = User::query();
            
            // Search functionality
            if ($request->has('search') && $request->search) {
                $query->where('name', 'like', '%' . $request->search . '%')
                      ->orWhere('email', 'like', '%' . $request->search . '%');
            }
            
            // Filter by role if provided
            if ($request->has('role') && $request->role) {
                $query->where('role', $request->role);
            }
            
            $perPage = $request->get('per_page', 10);
            $users = $query->orderBy('created_at', 'desc')->paginate($perPage);
            
            return response()->json([
                'success' => true,
                'data' => [
                    'users' => $users->items(),
                    'pagination' => [
                        'current_page' => $users->currentPage(),
                        'last_page' => $users->lastPage(),
                        'per_page' => $users->perPage(),
                        'total' => $users->total(),
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Admin users index error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to load users'
            ], 500);
        }
    }

    public function show(User $user): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => ['user' => $user]
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:6',
                'role' => 'required|in:user,admin',
            ]);

            $validatedData['password'] = bcrypt($validatedData['password']);
            $user = User::create($validatedData);

            return response()->json([
                'success' => true,
                'data' => ['user' => $user],
                'message' => 'User created successfully'
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Admin user store error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create user'
            ], 500);
        }
    }

    public function update(Request $request, User $user): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
                'role' => 'required|in:user,admin',
                'password' => 'nullable|string|min:6',
            ]);

            if (isset($validatedData['password'])) {
                $validatedData['password'] = bcrypt($validatedData['password']);
            } else {
                unset($validatedData['password']);
            }

            $user->update($validatedData);

            return response()->json([
                'success' => true,
                'data' => ['user' => $user->fresh()],
                'message' => 'User updated successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Admin user update error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user'
            ], 500);
        }
    }

    public function destroy(User $user): JsonResponse
    {
        try {
            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Admin user delete error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete user'
            ], 500);
        }
    }
}