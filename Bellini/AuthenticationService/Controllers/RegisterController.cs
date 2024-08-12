using BusinessLogic.Services.DTOs;
using BusinessLogic.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AuthenticationService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegisterController
    {
        private readonly IRegisterService _registerService;

        public RegisterController(IRegisterService registerService)
        {
            _registerService = registerService;
        }

        [HttpPost]
        public async Task<UserDto> Register([FromBody] RegisterDto registerDto, CancellationToken cancellationToken = default)
        {
            return await _registerService.RegisterUserAsync(registerDto, cancellationToken);
        }
    }
}
