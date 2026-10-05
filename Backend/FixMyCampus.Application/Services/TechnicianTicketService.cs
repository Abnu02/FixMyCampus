using FixMyCampus.Application.DTOs.Technician;
using FixMyCampus.Application.Interfaces;
using FixMyCampus.Domain.Entities;
using FixMyCampus.Domain.Enums;

namespace FixMyCampus.Application.Services;

public class TechnicianTicketService : ITechnicianTicketService
{
    private readonly ITechnicianTicketRepository _repository;

    public TechnicianTicketService(
        ITechnicianTicketRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<TechnicianTicketResponse>> GetMyTicketsAsync(
        string technicianId)
    {
        var tickets =
            await _repository.GetTicketsByTechnicianAsync(technicianId);

        return tickets.Select(MapToResponse);
    }

    public async Task<TechnicianTicketResponse?> UpdateStatusAsync(
        int ticketId,
        UpdateTechnicianStatusRequest request,
        string technicianId)
    {
        var ticket = await _repository.GetTicketByIdAsync(ticketId);

        if (ticket is null)
            return null;

        // Technician can only update tickets assigned to them
        if (ticket.TechnicianID != technicianId)
            throw new UnauthorizedAccessException(
                "You are not assigned to this ticket.");

        // Technician workflow:
        // Assigned -> InProgress
        // InProgress -> Resolved
        var validTransition =
            (ticket.Status == TicketStatus.Assigned &&
             request.Status == TicketStatus.InProgress)
            ||
            (ticket.Status == TicketStatus.InProgress &&
             request.Status == TicketStatus.Resolved);

        if (!validTransition)
        {
            throw new InvalidOperationException(
                $"Invalid status transition: {ticket.Status} -> {request.Status}");
        }

        var previousStatus = ticket.Status;

        ticket.Status = request.Status;

        var history = new TicketHistory
        {
            TicketId = ticket.Id,
            FromStatus = previousStatus,
            ToStatus = request.Status,
            ChangedByUserId = technicianId,
            ChangedAt = DateTime.UtcNow
        };

        ticket.History.Add(history);

        await _repository.SaveChangesAsync();

        return MapToResponse(ticket);
    }

    private static TechnicianTicketResponse MapToResponse(Ticket ticket)
    {
        return new TechnicianTicketResponse
        {
            Id = ticket.Id,
            Category = ticket.Category,
            BuildingName = ticket.Building.Name,
            Room = ticket.Room,
            Description = ticket.Description,
            Status = ticket.Status.ToString(),
            CreatedAt = ticket.CreatedAt
        };
    }
}