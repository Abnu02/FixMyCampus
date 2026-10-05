namespace FixMyCampus.Application.Auth;

public interface IJwtTokenService
{
    Task<string> GenerateTokenAsync(
        string userId,
        string email,
        string displayName,
        string role);
}