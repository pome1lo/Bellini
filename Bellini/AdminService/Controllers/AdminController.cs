using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using UtilsModelsLibrary.Attributes;
using UtilsModelsLibrary.Enums;

namespace AdminService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpPost("user")]
        [RolesOnlyAuthorize(Roles.Admin)]
        public async Task<IActionResult> CreateUserAsync([FromBody] AdminCreateUserDto dto, CancellationToken cancellationToken)
        {
            await _adminService.CreateUserAsync(dto, cancellationToken);
            return Created();
        }

        [HttpDelete("user/{id:int}")]
        [RolesOnlyAuthorize(Roles.Admin)]
        public async Task<IActionResult> DeleteUserAsync(int id, CancellationToken cancellationToken)
        {
            await _adminService.DeleteUserAsync(id, cancellationToken);
            return Created();
        }

        [HttpPost("game")]
        public async Task<IActionResult> CreateGameAsync([FromBody] AdminCreateGameDto dto, CancellationToken cancellationToken)
        {
            return Ok(
            //await _adminService.CreateGameAsync(dto, cancellationToken)
            );
        }

        [HttpPost("quiz")]
        public async Task<IActionResult> CreateQuizAsync([FromBody] AdminCreateQuizDto dto, CancellationToken cancellationToken)
        {
            return Ok(
            //await _adminService.CreateQuizAsync(dto, cancellationToken)
            );
        }
    }
}
