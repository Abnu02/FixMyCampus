using FixMyCampus.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FixMyCampus.Api.Controllers;

[ApiController]
[Route("api/v1/buildings")]
public class BuildingsController : ControllerBase
{
    private readonly IBuildingService _buildingService;

    public BuildingsController(IBuildingService buildingService)
    {
        _buildingService = buildingService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? campusId)
    {
        var buildings = await _buildingService.GetAllAsync(campusId);
        return Ok(buildings);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var building = await _buildingService.GetByIdAsync(id);

        if (building is null)
            return NotFound(new { message = $"Building {id} not found." });

        return Ok(building);
    }
}
