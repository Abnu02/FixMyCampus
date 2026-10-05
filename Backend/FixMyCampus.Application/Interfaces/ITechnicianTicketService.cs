using FixMyCampus.Application.DTOs.Technician;

namespace FixMyCampus.Application.Interfaces;

public interface ITechnicianTicketService
{
    Task<IEnumerable<TechnicianTicketResponse>> GetMyTicketsAsync(
        string technicianId);

    Task<TechnicianTicketResponse?> UpdateStatusAsync(
        int ticketId,
        UpdateTechnicianStatusRequest request,
        string technicianId);
}