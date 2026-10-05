using FixMyCampus.Domain.Entities;
using FixMyCampus.Domain.Enums;

namespace FixMyCampus.Infrastructure.Data;

public static class TicketSeeder
{
    public static async Task SeedAsync(FixMyCampusDbContext context)
    {
        if (context.Tickets.Any())
        {
            return;
        }

        var building = context.Buildings.First();

        var ticket = new Ticket
        {
            Category = "Electrical",
            BuildingId = building.Id,
            Room = "101",
            Description = "Test ticket for admin workflow",
            ReporterId = context.Users.First().Id,
            Status = TicketStatus.New,
            CreatedAt = DateTime.UtcNow
        };

        context.Tickets.Add(ticket);
        await context.SaveChangesAsync();
    }
}
