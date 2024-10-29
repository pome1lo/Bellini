using AutoMapper;
using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Models;
using FluentValidation;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BusinessLogicLayer.Services
{
    public class LoginService : ILoginService
    {
        private readonly IRepository<User> _userRepository;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly IValidator<LoginDto> _loginValidator;
        private readonly IDistributedCache _cache;

        public LoginService(IRepository<User> userRepository, IMapper mapper, IConfiguration configuration, IValidator<LoginDto> loginValidator, IDistributedCache cache)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _configuration = configuration;
            _loginValidator = loginValidator;
            _cache = cache;
        }

        public async Task<TokenDto> AuthenticateAsync(LoginDto loginDto, CancellationToken cancellationToken = default)
        {
            var validationResult = await _loginValidator.ValidateAsync(loginDto, cancellationToken);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            var cacheKey = $"User_{loginDto.Email}";
            var cachedUser = await _cache.GetStringAsync(cacheKey, cancellationToken);
            User? user;

            if (string.IsNullOrEmpty(cachedUser))
            {
                user = (await _userRepository.GetElementsAsync(cancellationToken)).FirstOrDefault(u => u.Email == loginDto.Email);
                if (user != null)
                {
                    await _cache.SetStringAsync(cacheKey, JsonConvert.SerializeObject(user), new DistributedCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30)
                    }, cancellationToken);
                }
            }
            else
            {
                user = JsonConvert.DeserializeObject<User>(cachedUser);
            }

            if (user is null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
            {
                throw new ValidationException("Invalid username or password.");
            }

            return new TokenDto()
            {
                AccessToken = GenerateAccessToken(user),
                RefreshToken = GenerateRefreshToken(user),
                Username = user.Username,
                UserId = user.Id
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
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
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
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
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
