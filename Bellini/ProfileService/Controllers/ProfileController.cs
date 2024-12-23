using BusinessLogicLayer.Attribute;
using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ProfileService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;
        private readonly IFileService _fileService;

        public ProfileController(IProfileService profileService, IFileService fileService)
        {
            _profileService = profileService;
            _fileService = fileService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id, CancellationToken cancellationToken)
        {
            return Ok(
                await _profileService.GetUserByIdAsync(id, cancellationToken)
            );
        }

        [HttpGet("{id}/info")]
        public async Task<IActionResult> GetProfileByUserIdAsync(int id, CancellationToken cancellationToken)
        {
            return Ok(
                await _profileService.GetProfileByUserIdAsync(id, cancellationToken)
            );
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProfiles(CancellationToken cancellationToken)
        {
            return Ok(
                await _profileService.GetAllProfilesAsync(cancellationToken)
            );
        }

        [HttpPut("{id}")]
        [ProfileOwnerAuthorizeFromQuery]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> UpdateProfile(int id, [FromForm] UpdateProfileDto updateProfileDto, [FromForm] IFormFile? profileImage, CancellationToken cancellationToken)
        {
            if (profileImage is not null)
            {
                var profileImageUrl = await _fileService.UploadFileAsync(profileImage, cancellationToken);

                var isDocker = Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true";
                updateProfileDto.ProfileImageUrl = (isDocker ? "/apigateway" : "https://localhost:7292") + profileImageUrl;
            }

            return Ok(
                await _profileService.UpdateProfileAsync(id, updateProfileDto, cancellationToken)
            );
        }

        [HttpDelete("{id}")]
        [ProfileOwnerAuthorizeFromQuery]
        public async Task<IActionResult> DeleteProfile(int id, CancellationToken cancellationToken)
        {
            await _profileService.DeleteProfileAsync(id, cancellationToken);
            return NoContent();
        }
    }
}
