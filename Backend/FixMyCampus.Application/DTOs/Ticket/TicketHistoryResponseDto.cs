namespace FixMyCampus.Application.DTOs.Ticket;

public class TicketHistoryResponseDto
{
    public string? FromStatus { get; set; }
    public string ToStatus { get; set; } = null!;
    public DateTime ChangedAt { get; set; }
}
