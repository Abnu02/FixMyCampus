using FixMyCampus.Domain.Entities;

namespace FixMyCampus.Infrastructure.Data;

public static class CampusSeeder
{
    public static async Task SeedAsync(FixMyCampusDbContext context)
    {
        if (context.Campuses.Any())
        {
            return;
        }

        var mainCampus = new Campus
        {
            Name = "Main Campus",
            Location = "Downtown",
            Buildings = new List<Building>
            {
                new Building { Name = "Engineering Building" },
                new Building { Name = "Science Building" },
                new Building { Name = "Administration Building" },
                new Building { Name = "Library" }
            }
        };

        context.Campuses.Add(mainCampus);
        await context.SaveChangesAsync();
    }
}
