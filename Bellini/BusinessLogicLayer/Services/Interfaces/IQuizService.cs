using BusinessLogicLayer.Services.DTOs;
using DataAccessLayer.Models;

namespace BusinessLogicLayer.Services.Interfaces
{
    public interface IQuizService
    {
        Task<(IEnumerable<QuizDto> Quizzes, int TotalCount)> GetAllQuizzesAsync(int limit, int offset, CancellationToken cancellationToken = default);
        Task<Quiz> GetQuizByIdAsync(int id, CancellationToken cancellationToken = default);

        Task<QuizSessionDto> StartQuizAsync(int quizId, int userId, CancellationToken cancellationToken = default);
        Task<QuizQuestionDto> GetNextQuestionAsync(int quizSessionId, CancellationToken cancellationToken = default);
        Task<QuizResultDto> EndQuizAsync(int quizSessionId, CancellationToken cancellationToken = default);
    }
}
