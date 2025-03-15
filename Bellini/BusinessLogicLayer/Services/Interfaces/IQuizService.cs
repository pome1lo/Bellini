using BusinessLogicLayer.Services.DTOs;
using DataAccessLayer.Models;

namespace BusinessLogicLayer.Services.Interfaces
{
    public interface IQuizService
    {
        /// <summary>
        /// Получает все квизы с пагинацией для пользователя.
        /// </summary>
        /// <param name="limit">Количество квизов на странице.</param>
        /// <param name="offset">Смещение для пагинации.</param>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Список квизов и их общее количество.</returns>
        Task<(IEnumerable<QuizDto> Quizzes, int TotalCount)> GetAllQuizzesAsync(int limit, int offset, int userId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Получает квиз по его идентификатору.
        /// </summary>
        /// <param name="id">Идентификатор квиза.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Данные квиза.</returns>
        Task<Quiz> GetQuizByIdAsync(int id, CancellationToken cancellationToken = default);

        /// <summary>
        /// Получает рейтинг всех квизов.
        /// </summary>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Список рейтингов квизов.</returns>
        Task<List<QuizRatingDto>> GetQuizRatingAsync(CancellationToken cancellationToken = default);

        /// <summary>
        /// Запускает квиз для пользователя.
        /// </summary>
        /// <param name="quizId">Идентификатор квиза.</param>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Данные о начатом квизе.</returns>
        Task<Quiz> StartQuizAsync(int quizId, int userId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Получает все квизы с пагинацией.
        /// </summary>
        /// <param name="limit">Количество квизов на странице.</param>
        /// <param name="offset">Смещение для пагинации.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Список квизов и их общее количество.</returns>
        Task<(IEnumerable<Quiz> Quizzes, int TotalCount)> GetAllQuizzesAsync(int limit, int offset, CancellationToken cancellationToken = default);

        /// <summary>
        /// Завершает квиз и сохраняет результаты.
        /// </summary>
        /// <param name="quizId">Идентификатор квиза.</param>
        /// <param name="quizFinishedDto">Данные о завершении квиза.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Данные о завершенном квизе.</returns>
        Task<Quiz> EndQuizAsync(int quizId, QuizFinishedDto quizFinishedDto, CancellationToken cancellationToken = default);

        /// <summary>
        /// Повторно запускает квиз для пользователя.
        /// </summary>
        /// <param name="quizId">Идентификатор квиза.</param>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        Task ReplayQuizAsync(int quizId, int userId, CancellationToken cancellationToken = default);

    }
}
