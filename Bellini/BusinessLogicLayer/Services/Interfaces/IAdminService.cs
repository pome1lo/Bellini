using BusinessLogicLayer.Services.DTOs;

namespace BusinessLogicLayer.Services.Interfaces
{
    public interface IAdminService
    {
        /// <summary>
        /// Создает нового пользователя.
        /// </summary>
        /// <param name="createUserDto">Данные для создания пользователя.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        Task CreateUserAsync(AdminCreateUserDto createUserDto, CancellationToken cancellationToken = default);

        /// <summary>
        /// Обновляет данные пользователя.
        /// </summary>
        /// <param name="updateUserDto">Данные для обновления пользователя.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        Task UpdateUserAsync(AdminUpdateUserDto updateUserDto, CancellationToken cancellationToken = default);

        /// <summary>
        /// Удаляет пользователя по его идентификатору.
        /// </summary>
        /// <param name="id">Идентификатор пользователя.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        Task DeleteUserAsync(int id, CancellationToken cancellationToken = default);

        /// <summary>
        /// Создает новую игру.
        /// </summary>
        /// <param name="createGameDto">Данные для создания игры.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        Task CreateGameAsync(AdminCreateGameDto createGameDto, CancellationToken cancellationToken = default);

        /// <summary>
        /// Обновляет данные игры.
        /// </summary>
        /// <param name="updateGameDto">Данные для обновления игры.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        Task UpdateGameAsync(AdminUpdateGameDto updateGameDto, CancellationToken cancellationToken = default);

        /// <summary>
        /// Удаляет игру по ее идентификатору.
        /// </summary>
        /// <param name="id">Идентификатор игры.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        Task DeleteGameAsync(int id, CancellationToken cancellationToken = default);

        /// <summary>
        /// Создает новый квиз.
        /// </summary>
        /// <param name="createQuizDto">Данные для создания квиза.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        Task CreateQuizAsync(AdminCreateQuizDto createQuizDto, CancellationToken cancellationToken = default);

        /// <summary>
        /// Обновляет данные квиза.
        /// </summary>
        /// <param name="updateQuizDto">Данные для обновления квиза.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        Task UpdateQuizAsync(AdminUpdateQuizDto updateQuizDto, CancellationToken cancellationToken = default);

        /// <summary>
        /// Удаляет квиз по его идентификатору.
        /// </summary>
        /// <param name="id">Идентификатор квиза.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        Task DeleteQuizAsync(int id, CancellationToken cancellationToken = default);

    }
}
