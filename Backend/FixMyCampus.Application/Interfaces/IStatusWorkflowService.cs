using FixMyCampus.Domain.Enums;

namespace FixMyCampus.Application.Interfaces;

public interface IStatusWorkflowService
{
    bool CanTransition(
        TicketStatus currentStatus,
        TicketStatus newStatus);
}