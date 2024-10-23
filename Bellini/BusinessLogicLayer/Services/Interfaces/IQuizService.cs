using BusinessLogicLayer.Services.DTOs;
using DataAccessLayer.Models;

namespace BusinessLogicLayer.Services.Interfaces
{
    public interface IQuizService
    {
        Task<(IEnumerable<QuizDto> Quizzes, int TotalCount)> GetAllQuizzesAsync(int limit, int offset, CancellationToken cancellationToken = default);
        Task<Quiz> GetQuizByIdAsync(int id, CancellationToken cancellationToken = default);
    }
}
