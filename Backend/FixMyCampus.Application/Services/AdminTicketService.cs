using FixMyCampus.Application.DTOs.Admin;
using FixMyCampus.Application.Interfaces;
using FixMyCampus.Domain.Entities;
using FixMyCampus.Domain.Enums;

namespace FixMyCampus.Application.Services;

public class AdminTicketService : IAdminTicketService
{
    private readonly IAdminTicketRepository _repository;
    private readonly IStatusWorkflowService _workflowService;

    public AdminTicketService(
        IAdminTicketRepository repository,
        IStatusWorkflowService workflowService)
    {
        _repository = repository;
        _workflowService = workflowService;
    }

    public async Task<IEnumerable<AdminTicketResponse>> GetTicketsAsync(
        int? buildingId,
        TicketStatus? status)
    {
        var tickets = await _repository.GetTicketsAsync(
            buildingId,
            status);

        return tickets.Select(MapToResponse);
    }

    public async Task<AdminTicketResponse?> AssignTechnicianAsync(
        int ticketId,
        AssignTechnicianRequest request,
        string adminUserId)
    {
        var ticket = await _repository.GetTicketByIdAsync(ticketId);

        if (ticket is null)
            return null;

     

        if (!_workflowService.CanTransition(
                ticket.Status,
                TicketStatus.Assigned))
        {
            throw new InvalidOperationException(
                $"A technician can only be assigned when the ticket is New. Current status: {ticket.Status}");
        }

        ticket.TechnicianID = request.TechnicianID;

        var history = new TicketHistory
        {
            TicketId = ticket.Id,
            FromStatus = ticket.Status,
            ToStatus = TicketStatus.Assigned,
            ChangedByUserId = adminUserId,
            ChangedAt = DateTime.UtcNow
        };

        ticket.Status = TicketStatus.Assigned;

        ticket.History.Add(history);

        await _repository.SaveChangesAsync();

        return MapToResponse(ticket);
    }

    public async Task<AdminTicketResponse?> UpdateStatusAsync(
        int ticketId,
        UpdateTicketStatusRequest request,
        string adminUserId)
    {
        var ticket = await _repository.GetTicketByIdAsync(ticketId);

        if (ticket is null)
            return null;

        if (!_workflowService.CanTransition(
                ticket.Status,
                request.Status))
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
            ChangedByUserId = adminUserId,
            ChangedAt = DateTime.UtcNow
        };

        ticket.History.Add(history);

        await _repository.SaveChangesAsync();

        return MapToResponse(ticket);
    }

    private static AdminTicketResponse MapToResponse(Ticket ticket)
    {
        return new AdminTicketResponse
        {
            Id = ticket.Id,
            Category = ticket.Category,
            BuildingName = ticket.Building.Name,
            Room = ticket.Room,
            Description = ticket.Description,
            TechnicianID = ticket.TechnicianID,
            Status = ticket.Status.ToString(),
            CreatedAt = ticket.CreatedAt
        };
    }
}