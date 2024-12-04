using AutoMapper;
using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Models;
using UtilsModelsLibrary.Exceptions;

namespace BusinessLogicLayer.Services
{
    public class UserService : IUserService
    {
        private readonly IRepository<User> _userRepository;
        private readonly IMapper _mapper;

        public UserService(IRepository<User> userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<UserDto> GetUserByIdAsync(int userId, CancellationToken cancellationToken = default)
        {
            var user = await _userRepository.GetItemAsync(userId, cancellationToken);

            if (user is null)
            {
                throw new NotFoundException($"User with ID {userId} not found.");
            }

            return _mapper.Map<UserDto>(user);
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync(CancellationToken cancellationToken = default)
        {
            var users = await _userRepository.GetElementsAsync(cancellationToken);
            return _mapper.Map<IEnumerable<UserDto>>(users);
        }

        public async Task<UserDto> CreateUserAsync(UserDto newUser, CancellationToken cancellationToken = default)
        {
            var existingUsers = await _userRepository.GetElementsAsync(cancellationToken);

            if (existingUsers.Any(x => x.Username == newUser.Username && x.Id != newUser.Id))
            {
                throw new RepeatingNameException("Names of several users cannot be equals to each other");
            }

            if (existingUsers.Any(x => x.Email == newUser.Email && x.Id != newUser.Id))
            {
                throw new RepeatingNameException("Emails of several users cannot be equals to each other");
            }

            newUser.Password = BCrypt.Net.BCrypt.HashPassword(newUser.Password);

            var user = _mapper.Map<User>(newUser);
            await _userRepository.CreateAsync(user, cancellationToken);
            return _mapper.Map<UserDto>(user);
        }

        public async Task UpdateUserAsync(int userId, UserDto updatedUser, CancellationToken cancellationToken = default)
        {
            var existingUsers = await _userRepository.GetElementsAsync(cancellationToken);

            if (!existingUsers.Any(x => x.Id == updatedUser.Id))
            {
                throw new NotFoundException("Cannot update non-existent user");
            }

            if (existingUsers.Any(x => x.Username == updatedUser.Username && x.Id != updatedUser.Id && x.Username is not null && updatedUser.Username is not null))
            {
                throw new RepeatingNameException("Names of several users cannot be equals to each other");
            }

            if (existingUsers.Any(x => x.Email == updatedUser.Email && x.Id != updatedUser.Id))
            {
                throw new RepeatingNameException("Emails of several users cannot be equals to each other");
            }

            var user = _mapper.Map<User>(updatedUser);
            await _userRepository.UpdateAsync(userId, user, cancellationToken);
        }

        public async Task DeleteUserAsync(int userId, CancellationToken cancellationToken = default)
        {
            var existingUser = await _userRepository.GetItemAsync(userId, cancellationToken);

            if (existingUser is null)
            {
                throw new NotFoundException("Cannot delete non-existent user");
            }

            await _userRepository.DeleteAsync(userId, cancellationToken);
        }
    }
}
