using FixMyCampus.Application.Auth;
using FixMyCampus.Application.Auth.DTOs;
using Microsoft.AspNetCore.Identity;

namespace FixMyCampus.Infrastructure.Identity;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IJwtTokenService _jwtTokenService;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        IJwtTokenService jwtTokenService)
    {
        _userManager = userManager;
        _jwtTokenService = jwtTokenService;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        var existingUser = await _userManager.FindByEmailAsync(request.Email);

        if (existingUser is not null)
            throw new InvalidOperationException("Email is already registered.");

        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            DisplayName = request.DisplayName
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            var errors = string.Join(
                ", ",
                result.Errors.Select(e => e.Description));

            throw new InvalidOperationException(errors);
        }

        await _userManager.AddToRoleAsync(user, "Reporter");

        var token = await _jwtTokenService.GenerateTokenAsync(
            user.Id,
            user.Email!,
            user.DisplayName,
            "Reporter");

        return new AuthResponse
        {
            Token = token,
            UserId = user.Id,
            Email = user.Email!,
            DisplayName = user.DisplayName,
            Role = "Reporter"
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);

        if (user is null)
            throw new UnauthorizedAccessException("Invalid email or password.");

        var passwordValid = await _userManager.CheckPasswordAsync(
            user,
            request.Password);

        if (!passwordValid)
            throw new UnauthorizedAccessException("Invalid email or password.");

        var roles = await _userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault() ?? "Reporter";

        var token = await _jwtTokenService.GenerateTokenAsync(
            user.Id,
            user.Email!,
            user.DisplayName,
            role);

        return new AuthResponse
        {
            Token = token,
            UserId = user.Id,
            Email = user.Email!,
            DisplayName = user.DisplayName,
            Role = role
        };
    }

    public async Task<AuthResponse?> GetCurrentUserAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user is null)
            return null;

        var roles = await _userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault() ?? "Reporter";

        return new AuthResponse
        {
            UserId = user.Id,
            Email = user.Email!,
            DisplayName = user.DisplayName,
            Role = role
        };
    }
}