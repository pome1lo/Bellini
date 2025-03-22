using BusinessLogicLayer.Services;
using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using UtilsModelsLibrary.Attribute;
using UtilsModelsLibrary.Attributes;
using UtilsModelsLibrary.Enums;

namespace AdminService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly IFileService _fileService;

        public AdminController(IAdminService adminService, IFileService fileService)
        {
            _adminService = adminService;
            _fileService = fileService;
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

        [HttpDelete("quiz/{id:int}")]
        [RolesOnlyAuthorize(Roles.Admin)]
        public async Task<IActionResult> DeleteQuizAsync(int id, CancellationToken cancellationToken)
        {
            await _adminService.DeleteQuizAsync(id, cancellationToken);
            return Created();
        }

        [HttpDelete("game/{id:int}")]
        [RolesOnlyAuthorize(Roles.Admin)]
        public async Task<IActionResult> DeleteGameAsync(int id, CancellationToken cancellationToken)
        {
            await _adminService.DeleteGameAsync(id, cancellationToken);
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
                await _adminService.CreateQuizAsync(dto, cancellationToken)
            );
        }

        [HttpPut("user/{id:int}")]
        [RolesOnlyAuthorize(Roles.Admin)]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> UpdateProfile(int id, [FromForm] AdminUpdateUserDto updateUserDto, [FromForm] IFormFile? profileImage, CancellationToken cancellationToken)
        {
            if (profileImage is not null)
            {
                var profileImageUrl = await _fileService.UploadFileAsync(profileImage, cancellationToken, FileTypeUpload.isAdminService);

                var isDocker = Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true";
                updateUserDto.ProfileImageUrl = (isDocker ? "/apigateway" : "https://localhost:7292") + profileImageUrl;
            }
            await _adminService.UpdateUserAsync(updateUserDto, cancellationToken);
            return Ok();
        }
    }
}
