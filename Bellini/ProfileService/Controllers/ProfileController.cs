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
        public async Task<IActionResult> GetProfileById(int id, CancellationToken cancellationToken)
        {
            var profile = await _profileService.GetProfileByIdAsync(id, cancellationToken);
            return Ok(profile);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProfiles(CancellationToken cancellationToken)
        {
            var profiles = await _profileService.GetAllProfilesAsync(cancellationToken);
            return Ok(profiles);
        }

        [HttpPut("{id}")]
        [ProfileOwnerAuthorize]
        public async Task<IActionResult> UpdateProfile(int id, [FromForm] UpdateProfileDto updateProfileDto, [FromForm] IFormFile? profileImage, CancellationToken cancellationToken)
        {
            if (profileImage != null)
            {
                var profileImageUrl = await _fileService.UploadFileAsync(profileImage, cancellationToken);
                updateProfileDto.ProfileImageUrl = profileImageUrl;
            }

            await _profileService.UpdateProfileAsync(id, updateProfileDto, cancellationToken);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [ProfileOwnerAuthorize]
        public async Task<IActionResult> DeleteProfile(int id, CancellationToken cancellationToken)
        {
            await _profileService.DeleteProfileAsync(id, cancellationToken);
            return NoContent();
        }
    }
}
