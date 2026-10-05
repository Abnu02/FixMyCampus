namespace FixMyCampus.Application.DTOs.Campus;

public class BuildingResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public int CampusId { get; set; }
    public string CampusName { get; set; } = null!;
}
