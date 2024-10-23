using BusinessLogicLayer.Services.DTOs;
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

        public async Task<(IEnumerable<QuizDto> Quizzes, int TotalCount)> GetAllQuizzesAsync(int limit, int offset, CancellationToken cancellationToken = default)
        {
            var allQuizzes = await _quizRepository.GetElementsAsync(cancellationToken);

            var totalCount = allQuizzes.Count();

            var paginatedQuizzes = allQuizzes
                .Skip(offset)
                .Take(limit)
                .Select(q => new QuizDto
                {
                    Id = q.Id,
                    GameName = q.GameName,
                    StartTime = q.StartTime,
                    EndTime = q.EndTime,
                    NumberOfQuestions = q.Questions.Count(),
                    GameCoverImageUrl = q.GameCoverImageUrl
                })
                .ToList();

            // Возвращаем список квизов и общее количество
            return (paginatedQuizzes, totalCount);
        }


        public async Task<Quiz> GetQuizByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _quizRepository.GetItemAsync(id, cancellationToken);
        }
    }
}
