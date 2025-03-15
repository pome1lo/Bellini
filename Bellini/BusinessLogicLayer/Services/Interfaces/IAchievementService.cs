using BusinessLogicLayer.Services.DTOs;
using UtilsModelsLibrary.Enums;

namespace BusinessLogicLayer.Services.Interfaces
{
    public interface IAchievementService
    {
        /// <summary>
        /// Получает информацию о конкретном достижении пользователя.
        /// </summary>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <param name="achievementType">Тип достижения.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Данные о достижении.</returns>
        Task<AchievementDto> GetAchievementAsync(int userId, AchievementType achievementType, CancellationToken cancellationToken = default);

        /// <summary>
        /// Получает список всех достижений пользователя.
        /// </summary>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Коллекция достижений пользователя.</returns>
        Task<IEnumerable<AchievementDto>> GetUserAchievementsAsync(int userId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Добавляет новое достижение пользователю.
        /// </summary>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <param name="achievementType">Тип достижения.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        Task AddAchievementAsync(int userId, AchievementType achievementType, CancellationToken cancellationToken = default);

        // /// <summary>
        // /// Удаляет достижение пользователя.
        // /// </summary>
        // /// <param name="userId">Идентификатор пользователя.</param>
        // /// <param name="achievementType">Тип достижения.</param>
        // /// <param name="cancellationToken">Токен отмены операции.</param>
        // Task DeleteAchievementAsync(int userId, AchievementType achievementType, CancellationToken cancellationToken = default);

    }
}
