using DataAccessLayer.Attribute;
using DataAccessLayer.Services.DTOs;
using DataAccessLayer.Services.Interfaces;
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
            return Ok(
                await _profileService.GetProfileByIdAsync(id, cancellationToken)
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
        [ProfileOwnerAuthorize]
        public async Task<IActionResult> UpdateProfile(int id, [FromForm] UpdateProfileDto updateProfileDto, [FromForm] IFormFile? profileImage, CancellationToken cancellationToken)
        {
            if (profileImage is not null)
            {
                var profileImageUrl = await _fileService.UploadFileAsync(profileImage, cancellationToken);
                updateProfileDto.ProfileImageUrl = "https://localhost:7292" + profileImageUrl;
            }

            return Ok(
                await _profileService.UpdateProfileAsync(id, updateProfileDto, cancellationToken)
            );
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
