using AutoMapper;
using BusinessLogicLayer.Services;
using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Validators;
using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Models;
using FluentValidation;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Moq;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BusinessLogicLayer.Test
{

    public class LoginServiceTests
    {
        private Mock<IRepository<User>> _userRepositoryMock;
        private Mock<IMapper> _mapperMock;
        private Mock<IConfiguration> _configurationMock;
        private Mock<IDistributedCache> _cache;
        private IValidator<LoginDto> _loginValidator;
        private LoginService _loginService;

        [SetUp]
        public void SetUp()
        {
            _userRepositoryMock = new Mock<IRepository<User>>();
            _mapperMock = new Mock<IMapper>();
            _configurationMock = new Mock<IConfiguration>();
            _loginValidator = new LoginDtoValidator();
            _cache = new Mock<IDistributedCache>();
            _loginService = new LoginService(_userRepositoryMock.Object, _mapperMock.Object, _configurationMock.Object, _loginValidator, _cache.Object);
        }

        [Test]
        public async Task AuthenticateAsync_ValidCredentials_ShouldReturnTokenDto()
        {
            var loginDto = new LoginDto
            {
                Email = "valid@example.com",
                Password = "ValidPassword123"
            };

            var user = new User
            {
                Id = 1,
                Username = "validUser",
                Email = "valid@example.com",
                Password = BCrypt.Net.BCrypt.HashPassword("ValidPassword123")
            };

            _userRepositoryMock.Setup(x => x.GetElementsAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(new List<User> { user });

            _configurationMock.Setup(x => x["Jwt:Key"]).Returns("supersecretkey");

            var result = await _loginService.AuthenticateAsync(loginDto);

            Assert.IsNotNull(result);
            Assert.IsNotEmpty(result.AccessToken);
            Assert.IsNotEmpty(result.RefreshToken);
        }

        [Test]
        public void AuthenticateAsync_InvalidCredentials_ShouldThrowUnauthorizedAccessException()
        {
            var loginDto = new LoginDto
            {
                Email = "invalid@example.com",
                Password = "InvalidPassword123"
            };

            _userRepositoryMock.Setup(x => x.GetElementsAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(new List<User>());

            Assert.ThrowsAsync<UnauthorizedAccessException>(() => _loginService.AuthenticateAsync(loginDto));
        }

        [Test]
        public void AuthenticateAsync_InvalidData_ShouldThrowValidationException()
        {
            var loginDto = new LoginDto
            {
                Email = "invalid",
                Password = "short"
            };

            Assert.ThrowsAsync<ValidationException>(() => _loginService.AuthenticateAsync(loginDto));
        }

        [Test]
        public async Task RefreshTokenAsync_ValidToken_ShouldReturnTokenDto()
        {
            var refreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6InBvbWUxbG8iLCJlbWFpbCI6InBhYXdvcmtlckBnbWFpbC5jb20iLCJuYmYiOjE3MjM2NzM2NzAsImV4cCI6MTcyNDI3ODQ3MCwiaWF0IjoxNzIzNjczNjcwfQ.L4YmsOC7oDQhEZ2NYU0_u1n3XZcVMpzZAdHH5bIcU5c";
            var user = new User
            {
                Id = 1,
                Username = "validUser",
                Email = "valid@example.com"
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("supersecretkey");
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Email, user.Email)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var validRefreshToken = tokenHandler.WriteToken(token);

            _userRepositoryMock.Setup(x => x.GetElementsAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(new List<User> { user });

            _configurationMock.Setup(x => x["Jwt:Key"]).Returns("supersecretkey");

            var result = await _loginService.RefreshTokenAsync(validRefreshToken);

            Assert.IsNotNull(result);
            Assert.IsNotEmpty(result.AccessToken);
            Assert.IsNotEmpty(result.RefreshToken);
        }

        [Test]
        public void RefreshTokenAsync_InvalidToken_ShouldThrowSecurityTokenException()
        {
            var invalidRefreshToken = "invalidRefreshToken";

            _configurationMock.Setup(x => x["Jwt:Key"]).Returns("supersecretkey");

            Assert.ThrowsAsync<SecurityTokenException>(() => _loginService.RefreshTokenAsync(invalidRefreshToken));
        }
    }
}
