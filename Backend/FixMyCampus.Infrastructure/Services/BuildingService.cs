using FixMyCampus.Application.DTOs.Campus;
using FixMyCampus.Application.Interfaces;
using FixMyCampus.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FixMyCampus.Infrastructure.Services;

public class BuildingService : IBuildingService
{
    private readonly FixMyCampusDbContext _context;

    public BuildingService(FixMyCampusDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<BuildingResponseDto>> GetAllAsync(int? campusId)
    {
        var query = _context.Buildings
            .Include(b => b.Campus)
            .AsQueryable();

        if (campusId.HasValue)
            query = query.Where(b => b.CampusId == campusId.Value);

        return await query
            .Select(b => new BuildingResponseDto
            {
                Id         = b.Id,
                Name       = b.Name,
                CampusId   = b.CampusId,
                CampusName = b.Campus.Name
            })
            .ToListAsync();
    }

    public async Task<BuildingResponseDto?> GetByIdAsync(int id)
    {
        var building = await _context.Buildings
            .Include(b => b.Campus)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (building is null)
            return null;

        return new BuildingResponseDto
        {
            Id         = building.Id,
            Name       = building.Name,
            CampusId   = building.CampusId,
            CampusName = building.Campus.Name
        };
    }
}
