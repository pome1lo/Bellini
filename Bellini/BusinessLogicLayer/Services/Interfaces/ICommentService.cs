using BusinessLogicLayer.Services.DTOs;
using DataAccessLayer.Models;

namespace BusinessLogicLayer.Services.Interfaces
{
    public interface ICommentService
    {
        Task<int> CreateCommentAsync(int gameId, CreateCommentDto createCommentDto, CancellationToken cancellationToken = default);
        Task<int> DeleteCommentAsync(int commentId, CancellationToken cancellationToken = default); // проверить id через атрибуты
        Task<IEnumerable<Comment>> GetAllActiveGamesAsync(int gameId, CancellationToken cancellationToken = default);
    }
}
