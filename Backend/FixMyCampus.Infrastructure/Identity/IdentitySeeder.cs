using Microsoft.AspNetCore.Identity;

namespace FixMyCampus.Infrastructure.Identity;

public static class IdentitySeeder
{
    public static async Task SeedAsync(
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager)
    {
        const string reporterRole = "Reporter";
        const string adminRole = "Admin";

        if (!await roleManager.RoleExistsAsync(reporterRole))
        {
            await roleManager.CreateAsync(
                new IdentityRole(reporterRole));
        }

        if (!await roleManager.RoleExistsAsync(adminRole))
        {
            await roleManager.CreateAsync(
                new IdentityRole(adminRole));
        }

        await CreateUserAsync(
            userManager,
            "admin@hackathon.local",
            "Admin123!",
            "Hackathon Admin",
            adminRole);

        await CreateUserAsync(
            userManager,
            "user@hackathon.local",
            "User123!",
            "Demo Reporter",
            reporterRole);
    }

    private static async Task CreateUserAsync(
        UserManager<ApplicationUser> userManager,
        string email,
        string password,
        string displayName,
        string role)
    {
        var user = await userManager.FindByEmailAsync(email);

        if (user is not null)
            return;

        user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            EmailConfirmed = true,
            DisplayName = displayName
        };

        var result = await userManager.CreateAsync(user, password);

        if (!result.Succeeded)
        {
            throw new InvalidOperationException(
                string.Join(
                    ", ",
                    result.Errors.Select(e => e.Description)));
        }

        await userManager.AddToRoleAsync(user, role);
    }
}