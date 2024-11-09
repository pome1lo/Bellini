using AutoMapper;
using BusinessLogicLayer.Exceptions;
using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using BusinessLogicLayer.Utils;
using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Models;
using FluentValidation;

namespace BusinessLogicLayer.Services
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
        private readonly ICacheService _cacheService;

        public RegisterService(
            IUserService userService,
            IMapper mapper,
            IRepository<User> repository,
            INotificationService notificationService,
            ICacheService cacheService,
            IValidator<RegisterDto> registerValidator,
            IValidator<CheckEmailDto> checkEmailDtoValidator,
            IValidator<CodeVerificationDto> codeVerificationValidator)
        {
            _mapper = mapper;
            _userService = userService;
            _repository = repository;
            _emailService = notificationService;
            _cacheService = cacheService;
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

            var user = await _repository.GetElementsAsync(cancellationToken);
            var existingUser = user.FirstOrDefault(u => u.Email == checkEmailDto.Email);

            if (existingUser != null)
            {
                // Пользователь с такой почтой уже существует и подтверждён
                if (existingUser.IsEmailVerified)
                {
                    throw new RepeatingNameException("A user with such an email already exists.");
                }
                else
                {
                    // Если пользователь существует, но почта ещё не подтверждена, то не выполняем ничего
                    throw new ValidationException("Email already exists but not verified.");
                }
            }

            var registrationCode = "111111";//VerificationCodeGenerator.GenerateRegistrationCode();
            var expiry = TimeSpan.FromMinutes(15);  // Время истечения кэша

            // Сохраняем код в кэш
            await _cacheService.SetAsync(checkEmailDto.Email, new CachedVerificationData { Code = registrationCode, Expiry = DateTime.UtcNow.Add(expiry) }, expiry);

            // Отправляем код на почту
            var notificationDto = new BaseEmailNotificationDto
            {
                Email = checkEmailDto.Email,
                Subject = "Registration Code",
                Body = $"Your registration code is {registrationCode}"
            };
            await _emailService.SendEmailNotificationAsync(notificationDto, cancellationToken);
        }

        public async Task VerifyCodeAsync(VerifyCodeDto verifyCodeDto, CancellationToken cancellationToken = default)
        {
            var cachedData = await _cacheService.GetAsync<CachedVerificationData>(verifyCodeDto.Email);

            if (cachedData == null || cachedData.Code != verifyCodeDto.VerificationCode || cachedData.Expiry < DateTime.UtcNow)
            {
                throw new ValidationException("Invalid or expired verification code.");
            }

            // Удаляем код из Redis
            //await _cacheService.RemoveAsync(verifyCodeDto.Email);
        }

        public async Task RegisterUserAsync(RegisterDto registerDto, CancellationToken cancellationToken = default)
        {
            var validationResult = await _registerValidator.ValidateAsync(registerDto, cancellationToken);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            // Получаем данные из кэша
            var cachedData = await _cacheService.GetAsync<CachedVerificationData>(registerDto.Email);
            if (cachedData == null || cachedData.Code != registerDto.RegistrationCode || cachedData.Expiry < DateTime.UtcNow)
            {
                throw new ValidationException("Invalid or expired registration code.");
            }

            // Если код верный, удаляем его из Redis
            await _cacheService.RemoveAsync(registerDto.Email);

            // Создаем пользователя
            var user = new User
            {
                Email = registerDto.Email,
                Username = registerDto.Username,
                Password = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                IsEmailVerified = true,
                IsActive = true
            };

            await _repository.CreateAsync(user, cancellationToken);
        }

    }
}
