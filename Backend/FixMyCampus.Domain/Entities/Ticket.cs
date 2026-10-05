using FixMyCampus.Domain.Enums;

namespace FixMyCampus.Domain.Entities;

public class Ticket
{
    public int Id { get; set; }

    public string Category { get; set; } = null!;

    public int BuildingId { get; set; }

    public Building Building { get; set; } = null!;

    public string Room { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string ReporterId { get; set; } = null!;

    public string? TechnicianName { get; set; }

    public TicketStatus Status { get; set; }

    public DateTime CreatedAt { get; set; }

    public ICollection<TicketHistory> History { get; set; } = new List<TicketHistory>();
}
