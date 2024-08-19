using BusinessLogic.Services.DTOs;
using BusinessLogicLayer.Services.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace BusinessLogic.Services.Interfaces
{
    public interface IRegisterService
    {
        Task<IActionResult> CheckEmailAsync(string email, CancellationToken cancellationToken = default);
        Task<IActionResult> VerifyCodeAsync(CodeVerificationDto codeVerificationDto, CancellationToken cancellationToken = default);
        Task<UserDto> RegisterUserAsync(RegisterDto registerDto, CancellationToken cancellationToken = default);
    }
}
