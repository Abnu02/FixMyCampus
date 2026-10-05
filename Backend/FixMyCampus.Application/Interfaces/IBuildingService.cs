using FixMyCampus.Application.DTOs.Campus;

namespace FixMyCampus.Application.Interfaces;

public interface IBuildingService
{
    Task<IEnumerable<BuildingResponseDto>> GetAllAsync(int? campusId);
    Task<BuildingResponseDto?> GetByIdAsync(int id);
}
