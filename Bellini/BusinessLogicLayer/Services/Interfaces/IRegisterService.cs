using DataAccessLayer.Services.DTOs;
using DataAccessLayer.Services.DTOs;

namespace DataAccessLayer.Services.Interfaces
{
    public interface IRegisterService
    {
        Task CheckEmailAsync(CheckEmailDto checkEmailDto, CancellationToken cancellationToken = default);
        Task VerifyCodeAsync(VerifyCodeDto verifyCodeDto, CancellationToken cancellationToken = default);
        Task RegisterUserAsync(RegisterDto registerDto, CancellationToken cancellationToken = default);
    }
}
