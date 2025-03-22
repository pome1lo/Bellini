using BusinessLogicLayer.Services.DTOs;

namespace BusinessLogicLayer.Services.Interfaces
{
    public interface IQuestionService
    {
        /// <summary>
        /// ������� ����� ������.
        /// </summary>
        /// <param name="createQuestionDto">������ ��� �������� �������.</param>
        /// <param name="cancellationToken">����� ������ ��������.</param>
        /// <returns>������������� ���������� �������.</returns>
        Task<int> CreateQuestionAsync(CreateGameQuestionDto createQuestionDto, CancellationToken cancellationToken = default);

        /// <summary>
        /// ������� ����� ������.
        /// </summary>
        /// <param name="createQuestionDto">������ ��� �������� �������.</param>
        /// <param name="cancellationToken">����� ������ ��������.</param>
        /// <returns>������������� ���������� �������.</returns>
        Task<int> CreateQuizQuestionAsync(CreateQuizQuestionDto createQuestionDto, CancellationToken cancellationToken = default);

        /// <summary>
        /// �������� ������ �� ��� ��������������.
        /// </summary>
        /// <param name="questionId">������������� �������.</param>
        /// <param name="cancellationToken">����� ������ ��������.</param>
        /// <returns>������ �������.</returns>
        Task<QuestionDto> GetQuestionByIdAsync(int questionId, CancellationToken cancellationToken = default);

        /// <summary>
        /// �������� ��� �������, ��������� � ����� �� �������������� ����.
        /// </summary>
        /// <param name="gameId">������������� ����.</param>
        /// <param name="cancellationToken">����� ������ ��������.</param>
        /// <returns>������ �������� ��� ��������� ����.</returns>
        Task<IEnumerable<QuestionDto>> GetQuestionsByGameIdAsync(int gameId, CancellationToken cancellationToken = default);

        /// <summary>
        /// �������� ��� �������.
        /// </summary>
        /// <param name="cancellationToken">����� ������ ��������.</param>
        /// <returns>������ ���� ��������.</returns>
        Task<IEnumerable<QuestionDto>> GetAllQuestionsAsync(CancellationToken cancellationToken = default);

        /// <summary>
        /// ������� ������ �� ��� �������������� � �������������� ����.
        /// </summary>
        /// <param name="questionId">������������� �������.</param>
        /// <param name="gameId">������������� ����.</param>
        /// <param name="cancellationToken">����� ������ ��������.</param>
        Task DeleteGameQuestionAsync(int questionId, int gameId, CancellationToken cancellationToken = default);

        /// <summary>
        /// ������� ������ �� ��� �������������� � �������������� ����.
        /// </summary>
        /// <param name="questionId">������������� �������.</param>
        /// <param name="gameId">������������� ����.</param>
        /// <param name="cancellationToken">����� ������ ��������.</param>
        Task DeleteQuizQuestionAsync(int questionId, int quizId, CancellationToken cancellationToken = default);
    }
}
