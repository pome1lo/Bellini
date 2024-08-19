using AutoMapper;
using BusinessLogic.Exceptions;
using BusinessLogic.Services.DTOs;
using BusinessLogic.Services.Interfaces;
using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using BusinessLogicLayer.Utils;
using DataAccess.Data.Interfaces;
using DataAccess.Models;
using FluentValidation;

namespace BusinessLogic.Services
{
    public class RegisterService : IRegisterService
    {
        private readonly IMapper _mapper;
        private readonly IRepository<User> _repository;
        private readonly IUserService _userService;
        private readonly INotificationService _emailService;
        private readonly IValidator<RegisterDto> _registerValidator;
        private readonly IValidator<CodeVerificationDto> _codeVerificationValidator;
        private readonly IValidator<CheckEmailDto> _checkEmailDtoValidator;

        public RegisterService(
            IUserService userService,
            IMapper mapper,
            IRepository<User> repository,
            INotificationService notificationService,
            IValidator<RegisterDto> registerValidator,
            IValidator<CheckEmailDto> checkEmailDtoValidator,
            IValidator<CodeVerificationDto> codeVerificationValidator)
        {
            _mapper = mapper;
            _userService = userService;
            _repository = repository;
            _emailService = notificationService;
            _checkEmailDtoValidator = checkEmailDtoValidator;
            _registerValidator = registerValidator;
            _codeVerificationValidator = codeVerificationValidator;
        }

        public async Task CheckEmailAsync(CheckEmailDto checkEmailDto, CancellationToken cancellationToken = default)
        {
            var validationResult = await _checkEmailDtoValidator.ValidateAsync(checkEmailDto, cancellationToken);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            var users = await _repository.GetElementsAsync(cancellationToken);
            var user = users.FirstOrDefault(u => u.Email == checkEmailDto.Email);

            var registrationCode = VerificationCodeGenerator.GenerateRegistrationCode();
            if (user is not null)
            {
                if (user.Username is not null && user.Password is not null)
                {
                    throw new RepeatingNameException("A user with such an email already exists.");
                }
                var modifiedUser = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    RegistrationCode = registrationCode,
                    VerificationCodeExpiry = DateTime.UtcNow.AddMinutes(15)
                };

                await _userService.UpdateUserAsync(user.Id, modifiedUser, cancellationToken);
            }
            else
            {
                user = new User
                {
                    Email = checkEmailDto.Email,
                    RegistrationCode = registrationCode,
                    VerificationCodeExpiry = DateTime.UtcNow.AddMinutes(15)
                };
                await _repository.CreateAsync(user, cancellationToken);
            }


            var notificationDto = new BaseEmailNotificationDto
            {
                Email = user.Email,
                Subject = "Registration Code",
                Body = $"Your registration code is {registrationCode}"
            };
            await _emailService.SendEmailNotificationAsync(notificationDto, cancellationToken);
        }

        public async Task RegisterUserAsync(RegisterDto registerDto, CancellationToken cancellationToken = default)
        {
            var validationResult = await _registerValidator.ValidateAsync(registerDto, cancellationToken);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }
            await ValidateUserAsync(registerDto, cancellationToken);

            var users = await _repository.GetElementsAsync(cancellationToken);
            var user = users.FirstOrDefault(u => u.Email == registerDto.Email);

            if (user?.RegistrationCode != registerDto.RegistrationCode)
            {
                throw new UnauthorizedAccessException("Invalid or expired registration code.");
            }

            var userDto = _mapper.Map<UserDto>(registerDto);
            userDto.Id = user.Id;
            userDto.Password = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);
            await _userService.UpdateUserAsync(user.Id, userDto, cancellationToken);
        }

        public async Task VerifyCodeAsync(VerifyCodeDto verifyCodeDto, CancellationToken cancellationToken = default)
        {
            var users = await _repository.GetElementsAsync(cancellationToken);
            var user = users.FirstOrDefault(u => u.Email == verifyCodeDto.Email);
            if (user == null || user.RegistrationCode != verifyCodeDto.VerificationCode || user.VerificationCodeExpiry < DateTime.UtcNow)
            {
                throw new UnauthorizedAccessException("Invalid or expired registration code.");
            }
        }

        private async Task ValidateUserAsync(RegisterDto registerDto, CancellationToken cancellationToken)
        {
            var existingUsers = await _userService.GetAllUsersAsync(cancellationToken);

            if (existingUsers.Any(u => u.Username == registerDto.Username))
            {
                throw new RepeatingNameException("Username already exists");
            }

            if (existingUsers.Any(u => u.Email == registerDto.Email && u.Username is not null))
            {
                throw new RepeatingNameException("Email already exists");
            }
        }
    }
}
