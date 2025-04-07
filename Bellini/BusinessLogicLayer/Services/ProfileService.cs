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
    public class ProfileService : IProfileService
    {
        private readonly IRepository<User> _userRepository;
        private readonly IRepository<QuizResults> _quizResultsRepository;
        private readonly IRepository<GameResults> _gameResultsRepository;
        private readonly IMapper _mapper;
        private readonly INotificationService _notificationService;
        private readonly IUserStatisticsService _userStatisticsService;
        private readonly IAchievementService _achievementService;
        private readonly IValidator<ProfileDto> _profileValidator;
        private readonly IValidator<UpdateProfileDto> _updateProfileValidator;
        private readonly IDistributedCache _cache;

        public ProfileService(
            IRepository<User> userRepository,
            IMapper mapper,
            INotificationService notificationService,
            IUserStatisticsService userStatisticsService,
            IAchievementService achievementService,
            IValidator<ProfileDto> profileValidator,
            IValidator<UpdateProfileDto> updateProfileValidator,
            IDistributedCache cache)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _profileValidator = profileValidator;
            _updateProfileValidator = updateProfileValidator;
            _cache = cache;
            _notificationService = notificationService;
            _userStatisticsService = userStatisticsService;
            _achievementService = achievementService;
        }

        public async Task<ProfileDto> GetUserByIdAsync(int profileId, CancellationToken cancellationToken = default)
        {
            var user = await _userRepository.GetItemAsync(profileId, cancellationToken);

            if (user is null)
            {
                throw new NotFoundException($"Profile with ID {profileId} not found.");
            }

            return _mapper.Map<ProfileDto>(user);
        }

        public async Task<UserProfileDto> GetProfileByUserIdAsync(int profileId, CancellationToken cancellationToken = default)
        {
            var user = await _userRepository.GetItemAsync(profileId);

            if (user == null)
            {
                throw new KeyNotFoundException("User not found.");
            }

            // Общая статистика
            int totalQuizzes = user.QuizResults.Count;
            int totalGames = user.GameResults.Count;

            // Средняя точность
            double averageQuizAccuracy = totalQuizzes > 0
                ? user.QuizResults.Average(q => (double)q.NumberOfCorrectAnswers / q.NumberOfQuestions * 100)
                : 0;

            double averageGameAccuracy = totalGames > 0
                ? user.GameResults.Average(g => (double)g.NumberOfCorrectAnswers / g.NumberOfQuestions * 100)
                : 0;

            // Последние завершенные
            var lastQuiz = user.QuizResults
                .OrderByDescending(q => q.EndTime)
                .FirstOrDefault();

            var lastGame = user.GameResults
                .OrderByDescending(g => g.Game.EndTime)
                .FirstOrDefault();

            // Лучшие результаты
            var bestQuiz = user.QuizResults
                .OrderByDescending(q => q.NumberOfCorrectAnswers)
                .FirstOrDefault();

            var bestGame = user.GameResults
                .OrderByDescending(g => g.NumberOfCorrectAnswers)
                .FirstOrDefault();

            return new UserProfileDto
            {
                TotalQuizzesCompleted = totalQuizzes,
                TotalGamesCompleted = totalGames,
                AverageQuizAccuracy = Math.Round(averageQuizAccuracy, 2),
                AverageGameAccuracy = Math.Round(averageGameAccuracy, 2),
                LastCompletedQuiz = lastQuiz?.Quiz?.GameName,
                LastCompletedGame = lastGame?.Game?.GameName,
                BestQuiz = bestQuiz?.Quiz?.GameName,
                BestGame = bestGame?.Game?.GameName
            };
        }

        public async Task<(IEnumerable<ProfileDto> Users, int TotalCount)> GetAllProfilesAsync(int limit, int offset, CancellationToken cancellationToken = default)
        {
            var users = await _userRepository.GetElementsAsync(cancellationToken);
            var totalCount = users.Count();

            var result = users
                .Skip(offset)
                .Take(limit)
                .ToList();

            return (_mapper.Map<IEnumerable<ProfileDto>>(result), totalCount);
        }

        public async Task<ProfileDto> UpdateProfileAsync(int profileId, UpdateProfileDto updateProfileDto, CancellationToken cancellationToken = default)
        {
            var validationResult = await _updateProfileValidator.ValidateAsync(updateProfileDto, cancellationToken);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            var existingUser = await _userRepository.GetItemAsync(profileId, cancellationToken);
            if (existingUser is null)
            {
                throw new NotFoundException($"Profile with ID {profileId} not found.");
            }

            var user = _mapper.Map(updateProfileDto, existingUser);
            await _userRepository.UpdateAsync(profileId, user, cancellationToken);

            var updatedUser = await _userRepository.GetItemAsync(profileId, cancellationToken);

            if (updatedUser is null)
            {
                throw new NotFoundException($"Profile with ID {profileId} not found.");
            }

            await _notificationService.CreateNotificationForUserAsync(new CreateNotificationDto
            {
                Message = "Ваш профиль был успешно обновлен",
                Title = "Обновление профиля",
                UserId = profileId
            });

            return _mapper.Map<ProfileDto>(updatedUser);
        }

        public async Task DeleteProfileAsync(int profileId, CancellationToken cancellationToken = default)
        {
            var existingUser = await _userRepository.GetItemAsync(profileId, cancellationToken);
            if (existingUser is null)
            {
                throw new NotFoundException($"Profile with ID {profileId} not found.");
            }
            _cache.Remove($"User_{existingUser.Email}");
            await _userRepository.DeleteAsync(profileId, cancellationToken);
        }
    }
}
