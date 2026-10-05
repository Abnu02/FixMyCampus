using FixMyCampus.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FixMyCampus.Api.Controllers;

[ApiController]
[Route("api/v1/campuses")]
public class CampusesController : ControllerBase
{
    private readonly ICampusService _campusService;

    public CampusesController(ICampusService campusService)
    {
        _campusService = campusService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var campuses = await _campusService.GetAllAsync();
        return Ok(campuses);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var campus = await _campusService.GetByIdAsync(id);

        if (campus is null)
            return NotFound(new { message = $"Campus {id} not found." });

        return Ok(campus);
    }
}
