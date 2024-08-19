using BusinessLogic.Services.DTOs;
using BusinessLogicLayer.Services.DTOs;

namespace BusinessLogic.Services.Interfaces
{
    public interface IRegisterService
    {
        Task CheckEmailAsync(CheckEmailDto checkEmailDto, CancellationToken cancellationToken = default);
        Task VerifyCodeAsync(VerifyCodeDto verifyCodeDto, CancellationToken cancellationToken = default);
        Task<UserDto> RegisterUserAsync(RegisterDto registerDto, CancellationToken cancellationToken = default);
    }
}
