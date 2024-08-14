using AutoMapper;
using BusinessLogic.Services.DTOs;
using BusinessLogic.Services.Interfaces;
using DataAccess.Data.Interfaces;
using DataAccess.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BusinessLogic.Services
{
    public class LoginService : ILoginService
    {
        private readonly IRepository<User> _userRepository;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;

        public LoginService(IRepository<User> userRepository, IMapper mapper, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _configuration = configuration;
        }

        public async Task<TokenDto> AuthenticateAsync(LoginDto loginDto, CancellationToken cancellationToken = default)
        {
            var user = (await _userRepository
                .GetElementsAsync(cancellationToken))
                .FirstOrDefault(u => u.Email == loginDto.Email && u.Password == loginDto.Password);

            if (user is null)
            {
                throw new UnauthorizedAccessException("Invalid username or password.");
            }

            return new TokenDto()
            {
                AccessToken = GenerateAccessToken(user),
                RefreshToken = GenerateRefreshToken(user)
            };
        }

        public string GenerateAccessToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Email, user.Email)
                }),
                Expires = DateTime.UtcNow.AddMinutes(15),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public string GenerateRefreshToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Email, user.Email)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public async Task<TokenDto> RefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
            SecurityToken validatedToken;

            try
            {
                var principal = tokenHandler.ValidateToken(refreshToken, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out validatedToken);

                var email = principal.FindFirst(ClaimTypes.Email)?.Value;
                var user = (await _userRepository.GetElementsAsync(cancellationToken)).FirstOrDefault(u => u.Email == email);

                if (user == null)
                {
                    throw new SecurityTokenException("Invalid token");
                }

                return new TokenDto
                {
                    AccessToken = GenerateAccessToken(user),
                    RefreshToken = GenerateRefreshToken(user)
                };
            }
            catch
            {
                throw new SecurityTokenException("Invalid token");
            }
        }
    }
}
