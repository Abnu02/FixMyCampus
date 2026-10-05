using System.Security.Claims;
using FixMyCampus.Application.DTOs.Admin;
using FixMyCampus.Application.Interfaces;
using FixMyCampus.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FixMyCampus.Api.Controllers;

[ApiController]
[Route("api/v1/admin/tickets")]
[Authorize(Roles = "Admin")]
public class AdminTicketsController : ControllerBase
{
    private readonly IAdminTicketService _adminTicketService;

    public AdminTicketsController(
        IAdminTicketService adminTicketService)
    {
        _adminTicketService = adminTicketService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AdminTicketResponse>>> GetTickets(
        [FromQuery] int? buildingId,
        [FromQuery] TicketStatus? status)
    {
        var tickets = await _adminTicketService.GetTicketsAsync(
            buildingId,
            status);

        return Ok(tickets);
    }

    [HttpPatch("{id}/assign")]
    public async Task<ActionResult<AdminTicketResponse>> AssignTechnician(
        int id,
        AssignTechnicianRequest request)
    {
        var adminUserId =
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (adminUserId is null)
            return Unauthorized();

        try
        {
            var ticket = await _adminTicketService.AssignTechnicianAsync(
                id,
                request,
                adminUserId);

            if (ticket is null)
                return NotFound();

            return Ok(ticket);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPatch("{id}/status")]
    public async Task<ActionResult<AdminTicketResponse>> UpdateStatus(
        int id,
        UpdateTicketStatusRequest request)
    {
        var adminUserId =
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (adminUserId is null)
            return Unauthorized();

        try
        {
            var ticket = await _adminTicketService.UpdateStatusAsync(
                id,
                request,
                adminUserId);

            if (ticket is null)
                return NotFound();

            return Ok(ticket);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}