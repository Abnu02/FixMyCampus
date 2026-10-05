using FixMyCampus.Domain.Entities;

namespace FixMyCampus.Application.Interfaces;

public interface ITechnicianTicketRepository
{
    Task<List<Ticket>> GetTicketsByTechnicianAsync(string technicianId);

    Task<Ticket?> GetTicketByIdAsync(int ticketId);

    Task SaveChangesAsync();
}