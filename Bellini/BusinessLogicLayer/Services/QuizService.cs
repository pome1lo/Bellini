using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Models;

namespace BusinessLogicLayer.Services
{
    public class QuizService : IQuizService
    {
        private readonly IRepository<Quiz> _quizRepository;
        private readonly IRepository<QuizResults> _quizResultsRepository;
        private readonly IRepository<QuizQuestion> _questionRepository;

        public QuizService(IRepository<Quiz> quizRepository, IRepository<QuizResults> quizResultsRepository, IRepository<QuizQuestion> questionRepository)
        {
            _quizRepository = quizRepository;
            _quizResultsRepository = quizResultsRepository;
            _questionRepository = questionRepository;
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
                    GameCoverImageUrl = q.GameCoverImageUrl
                })
                .ToList();

            return (paginatedQuizzes, totalCount);
        }

        public async Task<Quiz> GetQuizByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _quizRepository.GetItemAsync(id, cancellationToken);
        }

        public async Task<Quiz> StartQuizAsync(int quizId, int userId, CancellationToken cancellationToken = default)
        {
            var quiz = await _quizRepository.GetItemAsync(quizId, cancellationToken);
            if (quiz == null)
                throw new ArgumentException("Quiz not found");

            return quiz;
        }

        public async Task<Quiz> EndQuizAsync(int quizId, QuizFinishedDto quizFinishedDto, CancellationToken cancellationToken = default)
        {
            var quiz = await _quizRepository.GetItemAsync(quizId, cancellationToken);
            if (quiz == null)
            {
                throw new Exception("Quiz not found.");
            }

            int correctAnswersCount = 0;

            foreach (var userAnswer in quizFinishedDto.UserAnswers)
            {
                var question = quiz.Questions.FirstOrDefault(q => q.Id == userAnswer.QuestionId);
                if (question != null && question.AnswerOptions.Any(a => a.Id == userAnswer.AnswerId && a.IsCorrect))
                {
                    correctAnswersCount++;
                }
            }

            var quizResult = new QuizResults
            {
                QuizId = quizId,
                EndTime = DateTime.UtcNow,
                UserId = quizFinishedDto.UserId,
                NumberOfCorrectAnswers = correctAnswersCount,
                NumberOfQuestions = quiz.Questions.Count
            };

            await _quizResultsRepository.CreateAsync(quizResult, cancellationToken);

            return await _quizRepository.GetItemAsync(quizId, cancellationToken);
        }
    }
}
