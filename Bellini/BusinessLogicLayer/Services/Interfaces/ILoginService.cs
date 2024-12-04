using DataAccessLayer.Services.DTOs;
using DataAccessLayer.Models;

namespace DataAccessLayer.Services.Interfaces
{
    public interface ILoginService
    {
        Task<TokenDto> AuthenticateAsync(LoginDto loginDto, CancellationToken cancellationToken = default);
        Task<TokenDto> RefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default);
        public string GenerateRefreshToken(User user);
        public string GenerateAccessToken(User user);
    }
}
