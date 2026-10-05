using FixMyCampus.Application.DTOs.Campus;
using FixMyCampus.Application.Interfaces;
using FixMyCampus.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FixMyCampus.Infrastructure.Services;

public class CampusService : ICampusService
{
    private readonly FixMyCampusDbContext _context;

    public CampusService(FixMyCampusDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CampusResponseDto>> GetAllAsync()
    {
        return await _context.Campuses
            .Select(c => new CampusResponseDto
            {
                Id       = c.Id,
                Name     = c.Name,
                Location = c.Location
            })
            .ToListAsync();
    }

    public async Task<CampusResponseDto?> GetByIdAsync(int id)
    {
        var campus = await _context.Campuses.FindAsync(id);

        if (campus is null)
            return null;

        return new CampusResponseDto
        {
            Id       = campus.Id,
            Name     = campus.Name,
            Location = campus.Location
        };
    }
}
