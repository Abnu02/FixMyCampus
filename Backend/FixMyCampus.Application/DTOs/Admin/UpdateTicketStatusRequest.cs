using FixMyCampus.Domain.Enums;

namespace FixMyCampus.Application.DTOs.Admin;

public class UpdateTicketStatusRequest
{
    public TicketStatus Status { get; set; }
}
