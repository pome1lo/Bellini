using BusinessLogicLayer.Services.DTOs;
using UtilsModelsLibrary.Enums;

namespace BusinessLogicLayer.Services.Interfaces
{
    public interface IUserStatisticsService
    {
        Task<UserStatisticsDto> GetUserStatisticsAsync(int userId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Обновляет статистику пользователя в зависимости от типа достижения.
        /// Если достижение достигнуто, возвращает его, иначе null.
        /// </summary>
        Task<AchievementType?> UpdateUserStatisticsAsync(int userId, AchievementType actionType, CancellationToken cancellationToken = default);
    }
}
