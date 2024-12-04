using DataAccessLayer.Services.DTOs;
using DataAccessLayer.Models;

namespace DataAccessLayer.Services.Interfaces
{
    public interface IQuizService
    {
        Task<(IEnumerable<QuizDto> Quizzes, int TotalCount)> GetAllQuizzesAsync(int limit, int offset, CancellationToken cancellationToken = default);
        Task<Quiz> GetQuizByIdAsync(int id, CancellationToken cancellationToken = default);
        Task<Quiz> StartQuizAsync(int quizId, int userId, CancellationToken cancellationToken = default);
        Task<Quiz> EndQuizAsync(int quizId, QuizFinishedDto quizFinishedDto, CancellationToken cancellationToken = default);
    }
}
