using BusinessLogicLayer.Services.Interfaces;
using DataAccess.Data.Interfaces;
using DataAccessLayer.Models;

namespace BusinessLogicLayer.Services
{
    public class QuizService : IQuizService
    {
        private readonly IRepository<Quiz> _quizRepository;

        public QuizService(IRepository<Quiz> quizRepository)
        {
            _quizRepository = quizRepository;
        }

        public async Task<IEnumerable<Quiz>> GetAllQuizzesAsync(CancellationToken cancellationToken = default)
        {
            return await _quizRepository.GetElementsAsync(cancellationToken);
        }

        public async Task<Quiz> GetQuizByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _quizRepository.GetItemAsync(id, cancellationToken);
        }
    }
}
