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
        const string technicianRole = "Technician";

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


        if (!await roleManager.RoleExistsAsync(technicianRole))
        {
            await roleManager.CreateAsync(
                new IdentityRole(technicianRole));
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
        await CreateUserAsync(
            userManager,
            "teschnician@hackathon.local",
            "Technician123!",
            "Demo Technician",
            technicianRole);
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