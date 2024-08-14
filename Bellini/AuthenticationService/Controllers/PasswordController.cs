using BusinessLogic.Services.DTOs;
using BusinessLogic.Services.Interfaces;
using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuthenticationService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PasswordController : ControllerBase
    {
        private readonly IPasswordService _passwordService;

        public PasswordController(IPasswordService passwordService)
        {
            _passwordService = passwordService;
        }

        [HttpPost("change")] 
        [Authorize]
        public async Task<IActionResult> Change([FromBody] ChangePasswordDto changePasswordDto, CancellationToken cancellationToken = default)
        {
            await _passwordService.ChangePasswordAsync(changePasswordDto, cancellationToken);
            return Ok();
        }

        [HttpPost("reset")] 
        [Authorize]
        public async Task<IActionResult> Reset([FromBody] ChangePasswordDto changePasswordDto, CancellationToken cancellationToken = default)
        {
            await _passwordService.ResetPasswordAsync(changePasswordDto, cancellationToken);
            return Ok();
        }
    }
}
