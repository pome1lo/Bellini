using AutoMapper;
using BusinessLogic.Exceptions;
using BusinessLogic.Services.DTOs;
using BusinessLogic.Services.Interfaces;

namespace BusinessLogic.Services
{
    public class RegisterService : IRegisterService
    { 
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public RegisterService(IUserService userService, IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }

        public async Task<UserDto> RegisterUserAsync(RegisterDto registerDto, CancellationToken cancellationToken = default)
        { 
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

            else if (existingUsers.Any(u => u.Email == registerDto.Email))
            {
                throw new RepeatingNameException("Email already exists");
            }
        } 
    }
}
