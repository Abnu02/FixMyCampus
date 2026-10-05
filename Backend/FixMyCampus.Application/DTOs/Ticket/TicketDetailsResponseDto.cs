namespace FixMyCampus.Application.DTOs.Ticket;

public class TicketDetailsResponseDto
{
    public int Id { get; set; }
    public string Category { get; set; } = null!;
    public string CampusName { get; set; } = null!;
    public string BuildingName { get; set; } = null!;
    public string Room { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Status { get; set; } = null!;
    public string? TechnicianId { get; set; }
    public DateTime CreatedAt { get; set; }
    public IEnumerable<TicketHistoryResponseDto> History { get; set; } = [];
}
