using BusinessLogicLayer.Services.DTOs;
using UtilsModelsLibrary.Enums;

namespace BusinessLogicLayer.Services.Interfaces
{
    public interface IUserStatisticsService
    {
        /// <summary>
        /// Получает статистику пользователя по его идентификатору.
        /// </summary>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Данные статистики пользователя.</returns>
        Task<UserStatisticsDto> GetUserStatisticsAsync(int userId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Обновляет статистику пользователя в зависимости от типа достижения.
        /// Если достижение достигнуто, возвращает его, иначе возвращает null.
        /// </summary>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <param name="actionType">Тип действия, который влияет на статистику пользователя.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Достижение пользователя, если оно достигнуто, иначе null.</returns>
        Task<AchievementDto?> UpdateUserStatisticsAsync(int userId, UserActions actionType, CancellationToken cancellationToken = default);

    }
}
