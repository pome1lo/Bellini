using BusinessLogicLayer.Services.DTOs;

namespace BusinessLogicLayer.Services.Interfaces
{
    public interface IQuestionService
    {
        Task<int> CreateQuestionAsync(CreateQuestionDto createQuestionDto, CancellationToken cancellationToken = default);
        Task<QuestionDto> GetQuestionByIdAsync(int questionId, CancellationToken cancellationToken = default);
        Task<IEnumerable<QuestionDto>> GetQuestionsByGameIdAsync(int gameId, CancellationToken cancellationToken = default);
        Task<IEnumerable<QuestionDto>> GetAllQuestionsAsync(CancellationToken cancellationToken = default);
        Task UpdateQuestionAsync(int questionId, UpdateQuestionDto updateQuestionDto, CancellationToken cancellationToken = default);
        Task DeleteQuestionAsync(int questionId, CancellationToken cancellationToken = default);
    }
}
