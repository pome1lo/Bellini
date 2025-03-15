using BusinessLogicLayer.Services.DTOs;

namespace BusinessLogicLayer.Services.Interfaces
{
    public interface IUserService
    {
        /// <summary>
        /// Получает пользователя по его идентификатору.
        /// </summary>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Данные пользователя.</returns>
        Task<UserDto> GetUserByIdAsync(int userId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Получает всех пользователей.
        /// </summary>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Список пользователей.</returns>
        Task<IEnumerable<UserDto>> GetAllUsersAsync(CancellationToken cancellationToken = default);

        /// <summary>
        /// Создает нового пользователя.
        /// </summary>
        /// <param name="newUser">Данные для создания нового пользователя.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Данные созданного пользователя.</returns>
        Task<UserDto> CreateUserAsync(UserDto newUser, CancellationToken cancellationToken = default);

        /// <summary>
        /// Обновляет данные пользователя.
        /// </summary>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <param name="updatedUser">Обновленные данные пользователя.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Завершается без возвращаемого значения.</returns>
        Task UpdateUserAsync(int userId, UserDto updatedUser, CancellationToken cancellationToken = default);

        /// <summary>
        /// Удаляет пользователя по его идентификатору.
        /// </summary>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Завершается без возвращаемого значения.</returns>
        Task DeleteUserAsync(int userId, CancellationToken cancellationToken = default);

    }
}
