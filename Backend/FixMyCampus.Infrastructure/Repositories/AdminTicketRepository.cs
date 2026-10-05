using FixMyCampus.Application.Interfaces;
using FixMyCampus.Domain.Entities;
using FixMyCampus.Domain.Enums;
using FixMyCampus.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FixMyCampus.Infrastructure.Repositories;

public class AdminTicketRepository : IAdminTicketRepository
{
    private readonly FixMyCampusDbContext _context;

    public AdminTicketRepository(FixMyCampusDbContext context)
    {
        _context = context;
    }

    public async Task<List<Ticket>> GetTicketsAsync(
        int? buildingId,
        TicketStatus? status)
    {
        var query = _context.Tickets
            .Include(t => t.Building)
            .AsQueryable();

        if (buildingId.HasValue)
        {
            query = query.Where(t => t.BuildingId == buildingId.Value);
        }

        if (status.HasValue)
        {
            query = query.Where(t => t.Status == status.Value);
        }

        return await query
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<Ticket?> GetTicketByIdAsync(int ticketId)
    {
        return await _context.Tickets
            .Include(t => t.Building)
            .Include(t => t.History)
            .FirstOrDefaultAsync(t => t.Id == ticketId);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}