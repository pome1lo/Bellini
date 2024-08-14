using AutoMapper;
using BusinessLogic.Exceptions;
using BusinessLogic.Services;
using BusinessLogic.Services.DTOs;
using BusinessLogic.Services.Interfaces;
using BusinessLogicLayer.Services.Validators;
using FluentValidation;
using Moq;

namespace BusinessLogicLayer.Test
{
    public class RegisterServiceTests
    {
        private Mock<IUserService> _userServiceMock;
        private Mock<IMapper> _mapperMock;
        private IValidator<RegisterDto> _registerValidator;
        private RegisterService _registerService;

        [SetUp]
        public void SetUp()
        {
            _userServiceMock = new Mock<IUserService>();
            _mapperMock = new Mock<IMapper>();
            _registerValidator = new RegisterDtoValidator();
            _registerService = new RegisterService(_userServiceMock.Object, _mapperMock.Object, _registerValidator);
        }

        [Test]
        public async Task RegisterUserAsync_ValidData_ShouldReturnUserDto()
        {
            var registerDto = new RegisterDto
            {
                Username = "validUser",
                Email = "valid@example.com",
                Password = "ValidPassword123"
            };

            var userDto = new UserDto
            {
                Id = 1,
                Username = "validUser",
                Email = "valid@example.com",
                Password = "ValidPassword123"
            };

            _userServiceMock.Setup(x => x.GetAllUsersAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(new List<UserDto>());

            _mapperMock.Setup(x => x.Map<UserDto>(registerDto)).Returns(userDto);

            _userServiceMock.Setup(x => x.CreateUserAsync(It.IsAny<UserDto>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(userDto);

            var result = await _registerService.RegisterUserAsync(registerDto);
             
            Assert.IsNotNull(result);
            Assert.AreEqual(userDto.Username, result.Username);
            Assert.AreEqual(userDto.Email, result.Email);
        }

        [Test]
        public void RegisterUserAsync_ExistingUsername_ShouldThrowRepeatingNameException()
        {
            var registerDto = new RegisterDto
            {
                Username = "existingUser",
                Email = "new@example.com",
                Password = "ValidPassword123"
            };

            var existingUsers = new List<UserDto>
            {
                new UserDto { Username = "existingUser", Email = "existing@example.com" }
            };

            _userServiceMock.Setup(x => x.GetAllUsersAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(existingUsers);

            Assert.ThrowsAsync<RepeatingNameException>(() => _registerService.RegisterUserAsync(registerDto));
        }

        [Test]
        public void RegisterUserAsync_ExistingEmail_ShouldThrowRepeatingNameException()
        {
            var registerDto = new RegisterDto
            {
                Username = "newUser",
                Email = "existing@example.com",
                Password = "ValidPassword123"
            };

            var existingUsers = new List<UserDto>
            {
                new UserDto { Username = "existingUser", Email = "existing@example.com" }
            };

            _userServiceMock.Setup(x => x.GetAllUsersAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(existingUsers);

            Assert.ThrowsAsync<RepeatingNameException>(() => _registerService.RegisterUserAsync(registerDto));
        }

        [Test]
        public void RegisterUserAsync_InvalidData_ShouldThrowValidationException()
        {
            var registerDto = new RegisterDto
            {
                Username = "",
                Email = "invalid",
                Password = "short"
            };

            Assert.ThrowsAsync<ValidationException>(() => _registerService.RegisterUserAsync(registerDto));
        }
    }
}
