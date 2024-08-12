using BusinessLogic.Services.DTOs;
using DataAccess.Models;

namespace BusinessLogic.Services.Interfaces
{
    public interface ILoginService
    {
        Task<TokenDto> AuthenticateAsync(LoginDto loginDto, CancellationToken cancellationToken = default);

        public string GenerateRefreshToken(User user);
        public string GenerateAccessToken(User user);
    }
}
