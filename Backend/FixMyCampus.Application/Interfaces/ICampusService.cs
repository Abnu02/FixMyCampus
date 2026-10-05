using FixMyCampus.Application.DTOs.Campus;

namespace FixMyCampus.Application.Interfaces;

public interface ICampusService
{
    Task<IEnumerable<CampusResponseDto>> GetAllAsync();
    Task<CampusResponseDto?> GetByIdAsync(int id);
}
