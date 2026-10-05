using FixMyCampus.Domain.Enums;

namespace FixMyCampus.Application.DTOs.Technician;

public class UpdateTechnicianStatusRequest
{
    public TicketStatus Status { get; set; }
}