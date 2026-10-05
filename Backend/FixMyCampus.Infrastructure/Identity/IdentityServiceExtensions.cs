using Microsoft.AspNetCore.Identity;
using FixMyCampus.Infrastructure.Data;
using Microsoft.Extensions.DependencyInjection;

namespace FixMyCampus.Infrastructure.Identity;

public static class IdentityServiceExtensions
{
    public static IServiceCollection AddIdentityServices(
        this IServiceCollection services)
    {
        services
            .AddIdentityCore<ApplicationUser>()
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<FixMyCampusDbContext>()
            .AddDefaultTokenProviders();

        return services;
    }
}