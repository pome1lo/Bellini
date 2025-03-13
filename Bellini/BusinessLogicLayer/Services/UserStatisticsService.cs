using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UtilsModelsLibrary.Enums;

namespace BusinessLogicLayer.Services
{
    public class UserStatisticsService : IUserStatisticsService
    {
        private readonly IRepository<UserStatistics> _statisticsRepository;

        public UserStatisticsService(IRepository<UserStatistics> statisticsRepository)
        {
            _statisticsRepository = statisticsRepository;
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

        public async Task<AchievementType?> UpdateUserStatisticsAsync(int userId, AchievementType actionType, CancellationToken cancellationToken = default)
        {
            var stats = await _statisticsRepository.GetItemAsync(userId, cancellationToken);
            if (stats == null) return null;

            // Обновляем нужное поле в статистике
            switch (actionType)
            {
                case AchievementType.FirstQuizCompleted:
                case AchievementType.TenQuizzesCompleted:
                case AchievementType.TwentyFiveQuizzesCompleted:
                    stats.QuizzesCompleted++;
                    break;
                case AchievementType.FirstGamePlayed:
                case AchievementType.TenGamesPlayed:
                case AchievementType.TwentyFiveGamesPlayed:
                    stats.GamesPlayed++;
                    break;
                case AchievementType.FirstGameComment:
                    stats.GameComments++;
                    break;
                case AchievementType.FirstQuizComment:
                    stats.QuizComments++;
                    break;
                case AchievementType.FirstQuizCreated:
                    stats.QuizzesCreated++;
                    break;
                case AchievementType.FirstQuestionCreated:
                    stats.QuestionsCreated++;
                    break;
            }

            await _statisticsRepository.UpdateAsync(stats.Id, stats, cancellationToken);

            // Проверяем, достиг ли пользователь нового достижения
            return GetAchievementForStatistic(stats, actionType);
        }

        private AchievementType? GetAchievementForStatistic(UserStatistics stats, AchievementType actionType)
        {
            return actionType switch
            {
                AchievementType.FirstQuizCompleted when stats.QuizzesCompleted == 1 => AchievementType.FirstQuizCompleted,
                AchievementType.TenQuizzesCompleted when stats.QuizzesCompleted == 10 => AchievementType.TenQuizzesCompleted,
                AchievementType.TwentyFiveQuizzesCompleted when stats.QuizzesCompleted == 25 => AchievementType.TwentyFiveQuizzesCompleted,

                AchievementType.FirstGamePlayed when stats.GamesPlayed == 1 => AchievementType.FirstGamePlayed,
                AchievementType.TenGamesPlayed when stats.GamesPlayed == 10 => AchievementType.TenGamesPlayed,
                AchievementType.TwentyFiveGamesPlayed when stats.GamesPlayed == 25 => AchievementType.TwentyFiveGamesPlayed,

                AchievementType.FirstGameComment when stats.GameComments == 1 => AchievementType.FirstGameComment,
                AchievementType.FirstQuizComment when stats.QuizComments == 1 => AchievementType.FirstQuizComment,

                AchievementType.FirstQuizCreated when stats.QuizzesCreated == 1 => AchievementType.FirstQuizCreated,
                AchievementType.FirstQuestionCreated when stats.QuestionsCreated == 1 => AchievementType.FirstQuestionCreated,

                _ => null
            };
        }
    }
}
