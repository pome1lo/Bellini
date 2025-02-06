using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Models;
using Microsoft.Extensions.Caching.Distributed;
using UtilsModelsLibrary.Exceptions;

namespace BusinessLogicLayer.Services
{
    public class AdminService : IAdminService
    {
        private readonly IRepository<User> _userRepository;
        private readonly INotificationService _notificationService;
        private readonly IDistributedCache _cache;

        public AdminService(
            IRepository<User> repository,
            INotificationService notificationService,
            IDistributedCache cache)
        {
            _userRepository = repository;
            _notificationService = notificationService;
            _cache = cache;
        }

        public async Task CreateGameAsync(AdminCreateGameDto createGameDto, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public async Task CreateQuizAsync(AdminCreateQuizDto createQuizDto, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public async Task CreateUserAsync(AdminCreateUserDto createUserDto, CancellationToken cancellationToken = default)
        {
            var user = new User
            {
                Email = createUserDto.Email,
                Username = createUserDto.Username,
                Password = BCrypt.Net.BCrypt.HashPassword(createUserDto.Password),
                IsEmailVerified = false,
                IsActive = true,
                IsAdmin = createUserDto.IsAdmin,
            };

            await _userRepository.CreateAsync(user, cancellationToken);

            await _notificationService.CreateNotificationForUserAsync(new CreateNotificationDto
            {
                Message = "Welcome to Bellini",
                Title = "Registration notification",
                UserId = _userRepository.GetElementsAsync().Result.FirstOrDefault(x => x.Email == user.Email).Id
            });
        }

        public async Task DeleteGameAsync(int id, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public async Task DeleteQuizAsync(int id, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public async Task DeleteUserAsync(int id, CancellationToken cancellationToken = default)
        {
            var existingUser = await _userRepository.GetItemAsync(id, cancellationToken);
            if (existingUser is null)
            {
                throw new NotFoundException($"Profile with ID {id} not found.");
            }

            var cacheKey = $"User_{existingUser.Email}";
            await _cache.RemoveAsync(cacheKey, cancellationToken);

            await _userRepository.DeleteAsync(id, cancellationToken);
        }



        public async Task UpdateGameAsync(AdminUpdateGameDto updateGameDto, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public async Task UpdateQuizAsync(AdminUpdateQuizDto updateQuizDto, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public async Task UpdateUserAsync(AdminUpdateUserDto updateUserDto, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }
    }
}
