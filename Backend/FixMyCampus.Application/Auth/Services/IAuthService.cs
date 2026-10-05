using FixMyCampus.Application.Auth.DTOs;

namespace FixMyCampus.Application.Auth;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);

    Task<AuthResponse> LoginAsync(LoginRequest request);

    Task<AuthResponse?> GetCurrentUserAsync(string userId);
}