namespace FixMyCampus.Application.DTOs.Admin;

public class AdminTicketResponse
{
    public int Id { get; set; }
    public string Category { get; set; } = null!;
    public string BuildingName { get; set; } = null!;
    public string Room { get; set; } = null!;
    public string Description { get; set; } = null!;
    public int? TechnicianID { get; set; }
    public string Status { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
}