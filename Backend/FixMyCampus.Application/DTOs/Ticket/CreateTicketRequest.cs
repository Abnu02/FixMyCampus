namespace FixMyCampus.Application.DTOs.Ticket;

public class CreateTicketRequest
{
    public string Category { get; set; } = null!;
    public int BuildingId { get; set; }
    public string Room { get; set; } = null!;
    public string Description { get; set; } = null!;
}
