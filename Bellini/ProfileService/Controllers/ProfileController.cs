using BusinessLogicLayer.Services;
using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using UtilsModelsLibrary.Attribute;
using UtilsModelsLibrary.Enums;
using UtilsModelsLibrary.Extensions;

namespace ProfileService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;
        private readonly IFileService _fileService;
        private readonly IUserStatisticsService _userStatisticsService;

        public ProfileController(
            IProfileService profileService, 
            IFileService fileService, 
            IUserStatisticsService userStatisticsService)
        {
            _profileService = profileService;
            _fileService = fileService;
            _userStatisticsService = userStatisticsService;
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

        [HttpGet("all-data")]
        public async Task<IActionResult> GetAllProfiles([FromQuery] int limit = 10, [FromQuery] int offset = 0, CancellationToken cancellationToken = default)
        {
            var (users, totalCount) = await _profileService.GetAllProfilesAsync(limit, offset, cancellationToken);
            return Ok(new { users, total = totalCount });
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
                new
                {
                   profile = await _profileService.UpdateProfileAsync(id, updateProfileDto, cancellationToken),
                   achievement = await _userStatisticsService.UpdateUserStatisticsAsync(id, UserActions.ProfileEdit, cancellationToken)
                }    
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
