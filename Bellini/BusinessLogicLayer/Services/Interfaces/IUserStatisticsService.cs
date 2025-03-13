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
        Task<AchievementDto?> UpdateUserStatisticsAsync(int userId, UserActions actionType, CancellationToken cancellationToken = default);
    }
}
