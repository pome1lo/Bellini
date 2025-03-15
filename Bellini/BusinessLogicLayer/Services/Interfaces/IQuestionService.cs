using BusinessLogicLayer.Services.DTOs;

namespace BusinessLogicLayer.Services.Interfaces
{
    public interface IQuestionService
    {
        /// <summary>
        /// Создает новый вопрос.
        /// </summary>
        /// <param name="createQuestionDto">Данные для создания вопроса.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Идентификатор созданного вопроса.</returns>
        Task<int> CreateQuestionAsync(CreateQuestionDto createQuestionDto, CancellationToken cancellationToken = default);

        /// <summary>
        /// Получает вопрос по его идентификатору.
        /// </summary>
        /// <param name="questionId">Идентификатор вопроса.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Данные вопроса.</returns>
        Task<QuestionDto> GetQuestionByIdAsync(int questionId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Получает все вопросы, связанные с игрой по идентификатору игры.
        /// </summary>
        /// <param name="gameId">Идентификатор игры.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Список вопросов для указанной игры.</returns>
        Task<IEnumerable<QuestionDto>> GetQuestionsByGameIdAsync(int gameId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Получает все вопросы.
        /// </summary>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Список всех вопросов.</returns>
        Task<IEnumerable<QuestionDto>> GetAllQuestionsAsync(CancellationToken cancellationToken = default);

        /// <summary>
        /// Удаляет вопрос по его идентификатору и идентификатору игры.
        /// </summary>
        /// <param name="questionId">Идентификатор вопроса.</param>
        /// <param name="gameId">Идентификатор игры.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        Task DeleteQuestionAsync(int questionId, int gameId, CancellationToken cancellationToken = default);

    }
}
