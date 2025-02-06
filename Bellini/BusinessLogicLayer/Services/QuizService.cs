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

        public async Task<(IEnumerable<QuizDto> Quizzes, int TotalCount)> GetAllQuizzesAsync(int limit, int offset, int userId, CancellationToken cancellationToken = default)
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
                    GameCoverImageUrl = q.GameCoverImageUrl,
                    NumberOfQuestions = q.Questions.Count,
                    HasUserCompleted = userId != 0 && q.QuizResults.Any(qr => qr.UserId == userId)
                })
                .ToList();

            return (paginatedQuizzes, totalCount);
        }


        public async Task<Quiz> GetQuizByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _quizRepository.GetItemAsync(id, cancellationToken);
        }

        public async Task<(IEnumerable<Quiz> Quizzes, int TotalCount)> GetAllQuizzesAsync(int limit, int offset, CancellationToken cancellationToken = default)
        {
            var quizzes = await _quizRepository.GetElementsAsync(cancellationToken);
            var totalCount = quizzes.Count();

            var result = quizzes
                .Skip(offset)
                .Take(limit)
                .ToList();

            return (result, totalCount);
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

        public async Task<List<QuizRatingDto>> GetQuizRatingAsync(CancellationToken cancellationToken = default)
        {
            var quizResults = await _quizResultsRepository.GetElementsAsync(cancellationToken);

            var topPlayers = quizResults
                .GroupBy(qr => qr.User)  // Группируем по пользователю
                .Select(group => new
                {
                    User = group.Key,
                    TotalCorrectAnswers = group.Sum(qr => qr.NumberOfCorrectAnswers),
                    TotalQuestions = group.Sum(qr => qr.NumberOfQuestions),
                    LastEndTime = group.Max(qr => qr.EndTime)
                })
                .OrderByDescending(x => x.TotalCorrectAnswers)
                .ThenBy(x => x.LastEndTime)
                .Take(10)  // Топ-10 игроков
                .ToList();

            var result = topPlayers.Select((player, index) => new QuizRatingDto
            {
                Rank = index + 1,
                Username = player.User.Username,
                Email = player.User.Email,
                CorrectAnswers = player.TotalCorrectAnswers,
                TotalQuestions = player.TotalQuestions,
                Accuracy = player.TotalQuestions > 0
                    ? Math.Round((double)player.TotalCorrectAnswers / player.TotalQuestions * 100, 2)
                    : 0,
                EndTime = player.LastEndTime
            }).ToList();

            return result;
        }

    }
}
