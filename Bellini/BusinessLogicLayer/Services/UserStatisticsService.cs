using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Models;
using UtilsModelsLibrary.Base;
using UtilsModelsLibrary.Enums;
using UtilsModelsLibrary.Extensions;

namespace BusinessLogicLayer.Services
{
    public class UserStatisticsService : IUserStatisticsService
    {
        private readonly IRepository<UserStatistics> _statisticsRepository;
        private readonly IAchievementService _achievementService;

        public UserStatisticsService(IRepository<UserStatistics> statisticsRepository, IAchievementService achievementService)
        {
            _statisticsRepository = statisticsRepository;
            _achievementService = achievementService;
        }

        public async Task<UserStatisticsDto> GetUserStatisticsAsync(int userId, CancellationToken cancellationToken = default)
        {
            var stats = await _statisticsRepository.GetItemAsync(userId, cancellationToken);
            if (stats == null) return null!;

            return new UserStatisticsDto
            {
                UserId = stats.UserId,
                QuizzesCompleted = stats.QuizzesCompleted,
                GamesPlayed = stats.GamesPlayed,
                QuizComments = stats.QuizComments,
                GameComments = stats.GameComments,
                QuizzesCreated = stats.QuizzesCreated,
                QuestionsCreated = stats.QuestionsCreated
            };
        }

        public async Task<AchievementDto?> UpdateUserStatisticsAsync(int userId, UserActions actionType, CancellationToken cancellationToken = default)
        {
            var stats = await _statisticsRepository.GetItemAsync(userId, cancellationToken);
            if (stats == null)
            {
                await _statisticsRepository.CreateAsync(new() { UserId = userId });
                stats = await _statisticsRepository.GetItemAsync(userId, cancellationToken);
            }

            switch (actionType)
            {
                case UserActions.ProfileEdit: stats.ProfileEdits++; break;
                case UserActions.GameFinish: stats.GamesPlayed++; break;
                case UserActions.QuizzFinish: stats.QuizzesCompleted++; break;
                case UserActions.GameComment: stats.GameComments++; break;
                case UserActions.QuizComment: stats.QuizComments++; break;
                case UserActions.GameCreated: stats.GameCreated++; break;
                case UserActions.QuestionCreated: stats.QuestionsCreated++; break;
            }

            await _statisticsRepository.UpdateAsync(stats.Id, stats, cancellationToken);

            var achievement = GetAchievementForStatistic(stats, actionType);

            if (achievement.HasValue)
            {
                await _achievementService.AddAchievementAsync(userId, achievement.Value, cancellationToken);

                return new()
                {
                    AchievementType = achievement.Value,
                    DateAchieved = DateTime.Now,
                    UserId = userId,
                    Description = achievement.Value.GetDescription()
                };
            }
            return null;
        }

        private AchievementType? GetAchievementForStatistic(UserStatistics stats, UserActions actionType)
        {
            return actionType switch
            {
                UserActions.QuizzFinish => stats.QuizzesCompleted switch
                {
                    1 => AchievementType.FirstQuizCompleted,
                    10 => AchievementType.TenQuizzesCompleted,
                    25 => AchievementType.TwentyFiveQuizzesCompleted,
                    _ => null
                },

                UserActions.GameFinish => stats.GamesPlayed switch
                {
                    1 => AchievementType.FirstGamePlayed,
                    10 => AchievementType.TenGamesPlayed,
                    25 => AchievementType.TwentyFiveGamesPlayed,
                    _ => null
                },

                UserActions.GameComment when stats.GameComments == 1 => AchievementType.FirstGameComment,
                UserActions.QuizComment when stats.QuizComments == 1 => AchievementType.FirstQuizComment,

                UserActions.GameCreated when stats.GameCreated == 1 => AchievementType.FirstGameCreated,
                UserActions.QuestionCreated when stats.QuestionsCreated == 1 => AchievementType.FirstQuestionCreated,

                UserActions.ProfileEdit when stats.ProfileEdits == 1 => AchievementType.FirstProfileEdit,

                _ => null
            };
        }

    }
}
