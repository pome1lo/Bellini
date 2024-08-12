using BusinessLogic.Services.DTOs;
using BusinessLogic.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AuthenticationService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController
    {
        private readonly ILoginService _loginService;

        public LoginController(ILoginService authService)
        {
            _loginService = authService;
        }

        [HttpPost]
        public async Task<TokenDto> Login([FromBody] LoginDto loginDto, CancellationToken cancellationToken = default)
        {
            return await _loginService.AuthenticateAsync(loginDto, cancellationToken);
        }
    }
}
