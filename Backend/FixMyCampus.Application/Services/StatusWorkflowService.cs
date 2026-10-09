using FixMyCampus.Application.Interfaces;
using FixMyCampus.Domain.Enums;

namespace FixMyCampus.Application.Services;

public class StatusWorkflowService : IStatusWorkflowService
{
    public bool CanTransition(
        TicketStatus currentStatus,
        TicketStatus newStatus)
    {
        return currentStatus switch
        {
            TicketStatus.New =>
                newStatus == TicketStatus.Assigned,

            TicketStatus.Assigned =>
                newStatus == TicketStatus.InProgress,

            TicketStatus.InProgress =>
                newStatus == TicketStatus.Resolved,

            TicketStatus.Resolved =>
                false,

            _ => false
        };
    }
}