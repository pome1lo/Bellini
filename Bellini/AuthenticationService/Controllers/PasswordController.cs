using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuthenticationService.Controllers
{
    [ApiController]
    [Route("api/auth/[controller]")]
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
        public async Task<IActionResult> Reset([FromBody] ResetPasswordDto resetPasswordDto, CancellationToken cancellationToken = default)
        {
            await _passwordService.ResetPasswordAsync(resetPasswordDto, cancellationToken);
            return Ok();
        }

        [HttpPost("forgot")]
        public async Task<IActionResult> Forgot([FromBody] ForgotPasswordDto forgotPasswordDto, CancellationToken cancellationToken = default)
        {
            await _passwordService.ForgotPasswordAsync(forgotPasswordDto, cancellationToken);
            return Ok();
        }

        [HttpPost("verify")]
        public async Task<IActionResult> Verify([FromBody] VerifyCodeDto verifyCodeDto, CancellationToken cancellationToken = default)
        {
            await _passwordService.VerifyCodeAsync(verifyCodeDto, cancellationToken);
            return Ok();
        }
    }
}
