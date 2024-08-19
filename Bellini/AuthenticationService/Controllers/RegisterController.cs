using BusinessLogic.Services.DTOs;
using BusinessLogic.Services.Interfaces;
using BusinessLogicLayer.Services.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace AuthenticationService.Controllers
{
    [ApiController]
    [Route("api/auth/[controller]")]
    public class RegisterController : ControllerBase
    {
        private readonly IRegisterService _registerService;

        public RegisterController(IRegisterService registerService)
        {
            _registerService = registerService;
        }

        [HttpPost("check-email")]
        public async Task<IActionResult> CheckEmail([FromBody] CheckEmailDto checkEmailDto, CancellationToken cancellationToken = default)
        {
            await _registerService.CheckEmailAsync(checkEmailDto, cancellationToken);
            return Ok();
        }

        [HttpPost("verify-code")]
        public async Task<IActionResult> VerifyCode([FromBody] VerifyCodeDto codeVerificationDto, CancellationToken cancellationToken = default)
        {
            await _registerService.VerifyCodeAsync(codeVerificationDto, cancellationToken);
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto, CancellationToken cancellationToken = default)
        {
            return Ok(
                await _registerService.RegisterUserAsync(registerDto, cancellationToken)
            );
        }
    }
}
