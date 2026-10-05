using FixMyCampus.Application.Interfaces;
using FixMyCampus.Domain.Entities;
using FixMyCampus.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FixMyCampus.Infrastructure.Repositories;

public class TechnicianTicketRepository : ITechnicianTicketRepository
{
    private readonly FixMyCampusDbContext _context;

    public TechnicianTicketRepository(FixMyCampusDbContext context)
    {
        _context = context;
    }

    public async Task<List<Ticket>> GetTicketsByTechnicianAsync(string technicianId)
    {
        return await _context.Tickets
            .Include(t => t.Building)
            .Where(t => t.TechnicianID == technicianId)
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