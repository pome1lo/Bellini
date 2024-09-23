using BusinessLogic.Services.DTOs;
using BusinessLogic.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuthenticationService.Controllers
{
    [ApiController]
    [Route("api/auth/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly ILoginService _loginService;

        public LoginController(ILoginService authService)
        {
            _loginService = authService;
        }

        [HttpGet("protected")]
        [Authorize]
        public IActionResult Prtotected()
        {
            return Ok();
        }

        [HttpPost]
        public async Task<ActionResult<TokenDto>> Login([FromBody] LoginDto loginDto, CancellationToken cancellationToken = default)
        {
            return Ok(
                await _loginService.AuthenticateAsync(loginDto, cancellationToken)
            );
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] TokenDto tokenDto, CancellationToken cancellationToken = default)
        {
            return Ok(
                await _loginService.RefreshTokenAsync(tokenDto.RefreshToken, cancellationToken)
            );
        }
    }
}
