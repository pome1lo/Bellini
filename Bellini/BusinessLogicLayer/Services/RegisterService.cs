using AutoMapper;
using BusinessLogic.Exceptions;
using BusinessLogic.Services.DTOs;
using BusinessLogic.Services.Interfaces;
using FluentValidation;

namespace BusinessLogic.Services
{
    public class RegisterService : IRegisterService
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        private readonly IValidator<RegisterDto> _registerValidator;

        public RegisterService(IUserService userService, IMapper mapper, IValidator<RegisterDto> registerValidator)
        {
            _userService = userService;
            _mapper = mapper;
            _registerValidator = registerValidator;
        }

        public async Task<UserDto> RegisterUserAsync(RegisterDto registerDto, CancellationToken cancellationToken = default)
        {
            var validationResult = await _registerValidator.ValidateAsync(registerDto, cancellationToken);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            await ValidateUserAsync(registerDto, cancellationToken);

            var userDto = _mapper.Map<UserDto>(registerDto);
            return await _userService.CreateUserAsync(userDto, cancellationToken);
        }

        private async Task ValidateUserAsync(RegisterDto registerDto, CancellationToken cancellationToken)
        {
            var existingUsers = await _userService.GetAllUsersAsync(cancellationToken);

            if (existingUsers.Any(u => u.Username == registerDto.Username))
            {
                throw new RepeatingNameException("Username already exists");
            }

            if (existingUsers.Any(u => u.Email == registerDto.Email))
            {
                throw new RepeatingNameException("Email already exists");
            }
        }
    }
}
