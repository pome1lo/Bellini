using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Models;

namespace BusinessLogicLayer.Services
{
    public class AdminService : IAdminService
    {
        private readonly IRepository<User> _userRepository;
        private readonly INotificationService _notificationService;

        public AdminService(
            IRepository<User> repository,
            INotificationService notificationService)
        {
            _userRepository = repository;
            _notificationService = notificationService;
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
