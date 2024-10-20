using DataAccessLayer.Models;

namespace BusinessLogicLayer.Services.Interfaces
{
    public interface IQuizService
    {
        Task<IEnumerable<Quiz>> GetAllQuizzesAsync(CancellationToken cancellationToken = default);
        Task<Quiz> GetQuizByIdAsync(int id, CancellationToken cancellationToken = default);
    }
}
