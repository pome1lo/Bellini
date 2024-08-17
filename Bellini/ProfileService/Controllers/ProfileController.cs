using BusinessLogicLayer.Attribute;
using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ProfileService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;

        public ProfileController(IProfileService profileService)
        {
            _profileService = profileService;
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
        //[Authorize]
        [ProfileOwnerAuthorize]
        public async Task<IActionResult> UpdateProfile(int id, [FromBody] UpdateProfileDto updateProfileDto, CancellationToken cancellationToken)
        {
            await _profileService.UpdateProfileAsync(id, updateProfileDto, cancellationToken);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProfile(int id, CancellationToken cancellationToken)
        {
            await _profileService.DeleteProfileAsync(id, cancellationToken);
            return NoContent();
        }
    }
}
