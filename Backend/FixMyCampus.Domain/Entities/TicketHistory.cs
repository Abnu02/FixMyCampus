using FixMyCampus.Domain.Enums;

namespace FixMyCampus.Domain.Entities;

public class TicketHistory
{
    public int Id { get; set; }

    public int TicketId { get; set; }

    public Ticket Ticket { get; set; } = null!;

    public TicketStatus? FromStatus { get; set; }

    public TicketStatus ToStatus { get; set; }

    public string ChangedByUserId { get; set; } = null!;

    public DateTime ChangedAt { get; set; }
}
