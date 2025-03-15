using BusinessLogicLayer.Services.DTOs;
using DataAccessLayer.Models;

namespace BusinessLogicLayer.Services.Interfaces
{
    public interface ICommentService
    {
        /// <summary>
        /// Создает комментарий к игре.
        /// </summary>
        /// <param name="gameId">Идентификатор игры.</param>
        /// <param name="createCommentDto">Данные для создания комментария.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Идентификатор созданного комментария.</returns>
        Task<int> CreateGameCommentAsync(int gameId, CreateGameCommentDto createCommentDto, CancellationToken cancellationToken = default);

        /// <summary>
        /// Создает комментарий к квизу.
        /// </summary>
        /// <param name="quizId">Идентификатор квиза.</param>
        /// <param name="createCommentDto">Данные для создания комментария.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Идентификатор созданного комментария.</returns>
        Task<int> CreateQuizCommentAsync(int quizId, CreateQuizCommentDto createCommentDto, CancellationToken cancellationToken = default);

        /// <summary>
        /// Удаляет комментарий по его идентификатору.
        /// </summary>
        /// <param name="commentId">Идентификатор комментария.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Идентификатор удаленного комментария.</returns>
        Task<int> DeleteCommentAsync(int commentId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Получает все комментарии к игре по ее идентификатору.
        /// </summary>
        /// <param name="gameId">Идентификатор игры.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Коллекция комментариев к игре.</returns>
        Task<IEnumerable<GameComment>> GetAllCommentsByGameIdAsync(int gameId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Получает все комментарии к квизу по его идентификатору.
        /// </summary>
        /// <param name="quizId">Идентификатор квиза.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Коллекция комментариев к квизу.</returns>
        Task<IEnumerable<QuizComment>> GetAllCommentsByQuizIdAsync(int quizId, CancellationToken cancellationToken = default);

    }
}
