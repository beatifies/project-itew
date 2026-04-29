<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            Log::info('Login attempt', ['email' => $request->email]);

            $user = User::where('email', $request->email)->first();

            if (!$user) {
                Log::warning('Login failed: user not found', ['email' => $request->email]);
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials'
                ], 401);
            }

            // Check password: support both plain-text (manually inserted) and bcrypt hashes
            $rawPassword = $user->getRawOriginal('password') ?? $user->password;
            $passwordMatch = false;

            // First try bcrypt verify (normal flow)
            if (Hash::check($request->password, $rawPassword)) {
                $passwordMatch = true;
            }
            // Fallback: plain-text match (for manually inserted DB records)
            elseif ($request->password === $rawPassword) {
                $passwordMatch = true;
            }

            if (!$passwordMatch) {
                Log::warning('Login failed: password mismatch', ['email' => $request->email]);
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials'
                ], 401);
            }

            // Create a Sanctum token for API authentication
            $token = $user->createToken('auth-token')->plainTextToken;

            Log::info('Login successful', ['email' => $request->email, 'role' => $user->role]);

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'student_id' => $user->student_id ?? null,
                    'faculty_id' => $user->faculty_id ?? null,
                ]
            ]);
        } catch (\Throwable $e) {
            Log::error('Login exception', [
                'message' => $e->getMessage(),
                'class' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Login failed: ' . $e->getMessage(),
                'error' => get_class($e) . ': ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): JsonResponse
    {
        try {
            // Revoke all tokens for the user
            if ($request->user()) {
                $request->user()->currentAccessToken()->delete();
            }
        } catch (\Throwable $e) {
            Log::error('Logout error', ['message' => $e->getMessage()]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }
}
