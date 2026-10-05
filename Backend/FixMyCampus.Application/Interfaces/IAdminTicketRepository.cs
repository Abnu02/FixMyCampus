using FixMyCampus.Domain.Entities;
using FixMyCampus.Domain.Enums;

namespace FixMyCampus.Application.Interfaces;

public interface IAdminTicketRepository
{
    Task<List<Ticket>> GetTicketsAsync(
        int? buildingId,
        TicketStatus? status);

    Task<Ticket?> GetTicketByIdAsync(int ticketId);

    Task SaveChangesAsync();
}