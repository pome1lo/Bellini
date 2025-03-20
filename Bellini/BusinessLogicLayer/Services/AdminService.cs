using AutoMapper;
using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Models;
using FluentValidation;
using Microsoft.Extensions.Caching.Distributed;
using UtilsModelsLibrary.Exceptions;

namespace BusinessLogicLayer.Services
{
    public class AdminService : IAdminService
    {
        private readonly IRepository<User> _userRepository;
        private readonly IRepository<Game> _gameRepository;
        private readonly IRepository<Quiz> _quizRepository;
        private readonly INotificationService _notificationService;
        private readonly IValidator<AdminUpdateUserDto> _userValidator;
        private readonly IDistributedCache _cache;
        private readonly IMapper _mapper;

        public AdminService(
            IRepository<User> userRepository,
            IRepository<Game> gameRepository,
            IRepository<Quiz> quizRepository,
            INotificationService notificationService,
            IValidator<AdminUpdateUserDto> userValidator,
            IMapper mapper,
            IDistributedCache cache)
        {

            _userRepository = userRepository;
            _quizRepository = quizRepository;
            _gameRepository = gameRepository;
            _notificationService = notificationService;
            _userValidator = userValidator;
            _mapper = mapper;
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
                FirstName = createUserDto.FirstName,
                LastName = createUserDto.LastName,
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
            var existingGame = await _gameRepository.GetItemAsync(id, cancellationToken);
            if (existingGame is null)
            {
                throw new NotFoundException($"Game with ID {id} not found.");
            }

            await _gameRepository.DeleteAsync(id, cancellationToken);
        }

        public async Task DeleteQuizAsync(int id, CancellationToken cancellationToken = default)
        {
            var existingQuiz = await _quizRepository.GetItemAsync(id, cancellationToken);
            if (existingQuiz is null)
            {
                throw new NotFoundException($"Quiz with ID {id} not found.");
            }

            await _quizRepository.DeleteAsync(id, cancellationToken);
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
            var validationResult = await _userValidator.ValidateAsync(updateUserDto, cancellationToken);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            var existingUser = await _userRepository.GetItemAsync(updateUserDto.Id, cancellationToken);
            if (existingUser == null)
            {
                throw new KeyNotFoundException("User not found.");
            }

            if (!string.IsNullOrEmpty(updateUserDto.Password))
            {
                updateUserDto.Password = BCrypt.Net.BCrypt.HashPassword(updateUserDto.Password);
            }

            var user = _mapper.Map(updateUserDto, existingUser); 
            await _userRepository.UpdateAsync(user.Id, user, cancellationToken); 
        }
    }
}
