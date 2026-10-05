using FixMyCampus.Application.DTOs.Ticket;
using FixMyCampus.Application.Interfaces;
using FixMyCampus.Domain.Entities;
using FixMyCampus.Domain.Enums;
using FixMyCampus.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FixMyCampus.Infrastructure.Services;

public class TicketService : ITicketService
{
    private readonly FixMyCampusDbContext _context;

    public TicketService(FixMyCampusDbContext context)
    {
        _context = context;
    }

    public async Task<int> CreateAsync(CreateTicketRequest request, string reporterId)
    {
        var ticket = new Ticket
        {
            Category    = request.Category,
            BuildingId  = request.BuildingId,
            Room        = request.Room,
            Description = request.Description,
            ReporterId  = reporterId,
            Status      = TicketStatus.New,
            CreatedAt   = DateTime.UtcNow
        };

        _context.Tickets.Add(ticket);
        await _context.SaveChangesAsync();
        return ticket.Id;
    }

    public async Task<IEnumerable<TicketListResponseDto>> GetFeedAsync(int? buildingId, string? status)
    {
        var query = _context.Tickets
            .Include(t => t.Building)
                .ThenInclude(b => b.Campus)
            .AsQueryable();

        if (buildingId.HasValue)
            query = query.Where(t => t.BuildingId == buildingId.Value);

        if (!string.IsNullOrWhiteSpace(status) &&
            Enum.TryParse<TicketStatus>(status, ignoreCase: true, out var parsedStatus))
        {
            query = query.Where(t => t.Status == parsedStatus);
        }

        return await query
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new TicketListResponseDto
            {
                Id           = t.Id,
                Category     = t.Category,
                BuildingName = t.Building.Name,
                CampusName   = t.Building.Campus.Name,
                Room         = t.Room,
                Status       = t.Status.ToString(),
                CreatedAt    = t.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<TicketListResponseDto>> GetMyTicketsAsync(string reporterId)
    {
        return await _context.Tickets
            .Include(t => t.Building)
                .ThenInclude(b => b.Campus)
            .Where(t => t.ReporterId == reporterId)
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new TicketListResponseDto
            {
                Id           = t.Id,
                Category     = t.Category,
                BuildingName = t.Building.Name,
                CampusName   = t.Building.Campus.Name,
                Room         = t.Room,
                Status       = t.Status.ToString(),
                CreatedAt    = t.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<TicketDetailsResponseDto?> GetByIdAsync(int id)
    {
        var ticket = await _context.Tickets
            .Include(t => t.Building)
                .ThenInclude(b => b.Campus)
            .Include(t => t.History.OrderBy(h => h.ChangedAt))
            .FirstOrDefaultAsync(t => t.Id == id);

        if (ticket is null)
            return null;

        return new TicketDetailsResponseDto
        {
            Id             = ticket.Id,
            Category       = ticket.Category,
            CampusName     = ticket.Building.Campus.Name,
            BuildingName   = ticket.Building.Name,
            Room           = ticket.Room,
            Description    = ticket.Description,
            Status         = ticket.Status.ToString(),
            TechnicianId   = ticket.TechnicianID,
            CreatedAt      = ticket.CreatedAt,
            History        = ticket.History.Select(h => new TicketHistoryResponseDto
            {
                FromStatus = h.FromStatus?.ToString(),
                ToStatus   = h.ToStatus.ToString(),
                ChangedAt  = h.ChangedAt
            })
        };
    }
}
