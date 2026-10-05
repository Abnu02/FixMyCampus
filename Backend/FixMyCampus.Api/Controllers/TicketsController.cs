using System.Security.Claims;
using FixMyCampus.Application.DTOs.Ticket;
using FixMyCampus.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FixMyCampus.Api.Controllers;

[ApiController]
[Route("api/v1/tickets")]
public class TicketsController : ControllerBase
{
    private readonly ITicketService _ticketService;

    public TicketsController(ITicketService ticketService)
    {
        _ticketService = ticketService;
    }

    // POST /api/v1/tickets — Create a ticket (Reporter)
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateTicketRequest request)
    {
        var reporterId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(reporterId))
            return Unauthorized();

        var ticketId = await _ticketService.CreateAsync(request, reporterId);

        return CreatedAtAction(nameof(GetById), new { id = ticketId }, new { id = ticketId });
    }

    // GET /api/v1/tickets/my — My tickets (Reporter)
    // IMPORTANT: declared before {id} to avoid routing conflict
    [HttpGet("my")]
    [Authorize]
    public async Task<IActionResult> GetMyTickets()
    {
        var reporterId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(reporterId))
            return Unauthorized();

        var tickets = await _ticketService.GetMyTicketsAsync(reporterId);
        return Ok(tickets);
    }

    // GET /api/v1/tickets — Campus feed with optional filters
    [HttpGet]
    public async Task<IActionResult> GetFeed(
        [FromQuery] int? buildingId,
        [FromQuery] string? status)
    {
        var tickets = await _ticketService.GetFeedAsync(buildingId, status);
        return Ok(tickets);
    }

    // GET /api/v1/tickets/{id} — Ticket details
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var ticket = await _ticketService.GetByIdAsync(id);

        if (ticket is null)
            return NotFound(new { message = $"Ticket {id} not found." });

        return Ok(ticket);
    }
}
