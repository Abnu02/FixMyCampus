using FixMyCampus.Application.DTOs.Ticket;

namespace FixMyCampus.Application.Interfaces;

public interface ITicketService
{
    Task<int> CreateAsync(CreateTicketRequest request, string reporterId);
    Task<IEnumerable<TicketListResponseDto>> GetFeedAsync(int? buildingId, string? status);
    Task<IEnumerable<TicketListResponseDto>> GetMyTicketsAsync(string reporterId);
    Task<TicketDetailsResponseDto?> GetByIdAsync(int id);
}
