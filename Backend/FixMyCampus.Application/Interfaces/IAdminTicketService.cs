using FixMyCampus.Application.DTOs.Admin;
using FixMyCampus.Domain.Enums;

namespace FixMyCampus.Application.Interfaces;

public interface IAdminTicketService
{
    Task<IEnumerable<AdminTicketResponse>> GetTicketsAsync(
        int? buildingId,
        TicketStatus? status);

    Task<AdminTicketResponse?> AssignTechnicianAsync(
        int ticketId,
        AssignTechnicianRequest request,
        string adminUserId);

    Task<AdminTicketResponse?> UpdateStatusAsync(
        int ticketId,
        UpdateTicketStatusRequest request,
        string adminUserId);
}