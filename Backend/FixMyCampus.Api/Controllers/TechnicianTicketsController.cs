using System.Security.Claims;
using FixMyCampus.Application.DTOs.Technician;
using FixMyCampus.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FixMyCampus.Api.Controllers;

[ApiController]
[Route("api/v1/technician/tickets")]
[Authorize(Roles = "Technician")]
public class TechnicianTicketsController : ControllerBase
{
    private readonly ITechnicianTicketService _technicianTicketService;

    public TechnicianTicketsController(
        ITechnicianTicketService technicianTicketService)
    {
        _technicianTicketService = technicianTicketService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TechnicianTicketResponse>>> GetMyTickets()
    {
        var technicianId =
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (technicianId is null)
            return Unauthorized();

        var tickets =
            await _technicianTicketService.GetMyTicketsAsync(technicianId);

        return Ok(tickets);
    }

    [HttpPatch("{id}/status")]
    public async Task<ActionResult<TechnicianTicketResponse>> UpdateStatus(
        int id,
        UpdateTechnicianStatusRequest request)
    {
        var technicianId =
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (technicianId is null)
            return Unauthorized();

        try
        {
            var ticket =
                await _technicianTicketService.UpdateStatusAsync(
                    id,
                    request,
                    technicianId);

            if (ticket is null)
                return NotFound();

            return Ok(ticket);
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(
                StatusCodes.Status403Forbidden,
                new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}