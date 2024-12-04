using DataAccessLayer.Models;
using DataAccessLayer.Services.DTOs;

namespace DataAccessLayer.Services.Interfaces
{
    public interface ICommentService
    {
        Task<int> CreateGameCommentAsync(int gameId, CreateGameCommentDto createCommentDto, CancellationToken cancellationToken = default);
        Task<int> CreateQuizCommentAsync(int quizId, CreateQuizCommentDto createCommentDto, CancellationToken cancellationToken = default);
        Task<int> DeleteCommentAsync(int commentId, CancellationToken cancellationToken = default); // проверить id через атрибуты
        Task<IEnumerable<GameComment>> GetAllCommentsByGameIdAsync(int gameId, CancellationToken cancellationToken = default);
        Task<IEnumerable<QuizComment>> GetAllCommentsByQuizIdAsync(int quizId, CancellationToken cancellationToken = default);
    }
}
