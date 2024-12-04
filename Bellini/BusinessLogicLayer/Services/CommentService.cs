using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Models;
using DataAccessLayer.Services.DTOs;
using DataAccessLayer.Services.Interfaces;
using UtilsModelsLibrary.Exceptions;

namespace DataAccessLayer.Services
{
    public class CommentService : ICommentService
    {
        private readonly IRepository<GameComment> _gameCommentRepository;
        private readonly IRepository<QuizComment> _quizCommentRepository;
        private readonly IRepository<Game> _gameRepository;
        private readonly IRepository<Quiz> _quizRepository;

        public CommentService(IRepository<GameComment> commentRepository, IRepository<Game> gameRepository, IRepository<Quiz> quizRepository, IRepository<QuizComment> quizCommentRepository)
        {
            _gameCommentRepository = commentRepository;
            _quizRepository = quizRepository;
            _gameRepository = gameRepository;
            _quizCommentRepository = quizCommentRepository;
        }

        public async Task<int> CreateGameCommentAsync(int gameId, CreateGameCommentDto createCommentDto, CancellationToken cancellationToken = default)
        {
            var game = await _gameRepository.GetItemAsync(gameId, cancellationToken);

            if (game is null)
            {
                throw new NotFoundException($"Game with ID {gameId} not found.");
            }

            var comment = new GameComment
            {
                GameId = game.Id,
                UserId = createCommentDto.UserId,
                Content = createCommentDto.Content,
                Username = createCommentDto.Username,
                ProfileImageUrl = createCommentDto.ProfileImageUrl,
            };

            await _gameCommentRepository.CreateAsync(comment, cancellationToken);
            return comment.Id;
        }

        public async Task<int> CreateQuizCommentAsync(int quizId, CreateQuizCommentDto createCommentDto, CancellationToken cancellationToken = default)
        {
            var quiz = await _quizRepository.GetItemAsync(quizId, cancellationToken);

            if (quiz is null)
            {
                throw new NotFoundException($"Quiz with ID {quizId} not found.");
            }

            var comment = new QuizComment
            {
                QuizId = quiz.Id,
                UserId = createCommentDto.UserId,
                Content = createCommentDto.Content,
                Username = createCommentDto.Username,
                ProfileImageUrl = createCommentDto.ProfileImageUrl,
            };

            await _quizCommentRepository.CreateAsync(comment, cancellationToken);
            return comment.Id;
        }

        public async Task<int> DeleteCommentAsync(int commentId, CancellationToken cancellationToken = default)
        {
            await _gameCommentRepository.DeleteAsync(commentId, cancellationToken);
            return commentId;
        }

        public async Task<IEnumerable<GameComment>> GetAllCommentsByGameIdAsync(int gameId, CancellationToken cancellationToken = default)
        {
            var game = await _gameRepository.GetItemAsync(gameId, cancellationToken);

            if (game is null)
            {
                throw new NotFoundException($"Game with ID {gameId} not found.");
            }

            var comments = await _gameCommentRepository.GetElementsAsync(cancellationToken);
            return comments.Where(c => c.GameId == game.Id);
        }

        public async Task<IEnumerable<QuizComment>> GetAllCommentsByQuizIdAsync(int quizId, CancellationToken cancellationToken = default)
        {
            var quiz = await _quizRepository.GetItemAsync(quizId, cancellationToken);

            if (quiz is null)
            {
                throw new NotFoundException($"Game with ID {quizId} not found.");
            }

            var comments = await _quizCommentRepository.GetElementsAsync(cancellationToken);
            return comments.Where(c => c.QuizId == quiz.Id);
        }
    }
}
