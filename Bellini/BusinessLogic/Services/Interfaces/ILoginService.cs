using BusinessLogic.Services.DTOs;

namespace BusinessLogic.Services.Interfaces
{
    public interface ILoginService
    {
        Task<string> AuthenticateAsync(LoginDto loginDto, CancellationToken cancellationToken = default);
    }
}
