<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tip;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TipController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Tip::query();
        
        // Search functionality
        if ($request->has('search') && $request->search) {
            $query->where('tip_text', 'like', '%' . $request->search . '%');
        }
        
        $perPage = $request->get('per_page', 10);
        $tips = $query->orderBy('created_at', 'desc')->paginate($perPage);
        
        return response()->json([
            'success' => true,
            'data' => [
                'tips' => $tips->items(),
                'pagination' => [
                    'current_page' => $tips->currentPage(),
                    'last_page' => $tips->lastPage(),
                    'per_page' => $tips->perPage(),
                    'total' => $tips->total(),
                ]
            ]
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'tip_text' => 'required|string|max:1000',
            'applies_to_activity_type' => 'nullable|string|max:100',
            'applies_to_budget_tag' => 'nullable|in:$,$$,$$$,$$$$,$$$$$',
            'applies_to_energy_tag' => 'nullable|in:Low,Medium,High',
            'is_generic' => 'boolean',
        ]);

        $tip = Tip::create($validatedData);

        return response()->json([
            'success' => true,
            'data' => ['tip' => $tip],
            'message' => 'Tip created successfully'
        ], 201);
    }

    public function show(Tip $tip): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => ['tip' => $tip]
        ]);
    }

    public function update(Request $request, Tip $tip): JsonResponse
    {
        $validatedData = $request->validate([
            'tip_text' => 'required|string|max:1000',
            'applies_to_activity_type' => 'nullable|string|max:100',
            'applies_to_budget_tag' => 'nullable|in:$,$$,$$$,$$$$,$$$$$',
            'applies_to_energy_tag' => 'nullable|in:Low,Medium,High',
            'is_generic' => 'boolean',
        ]);

        $tip->update($validatedData);

        return response()->json([
            'success' => true,
            'data' => ['tip' => $tip],
            'message' => 'Tip updated successfully'
        ]);
    }

    public function destroy(Tip $tip): JsonResponse
    {
        $tip->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tip deleted successfully'
        ]);
    }
}