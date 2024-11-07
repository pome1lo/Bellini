using BusinessLogicLayer.Exceptions;
using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Models;

namespace BusinessLogicLayer.Services
{
    public class CommentService : ICommentService
    {
        private readonly IRepository<Comment> _commentRepository;
        private readonly IRepository<Game> _gameRepository;

        public CommentService(IRepository<Comment> commentRepository, IRepository<Game> gameRepository)
        {
            _commentRepository = commentRepository;
            _gameRepository = gameRepository;
        }

        public async Task<int> CreateCommentAsync(int gameId, CreateCommentDto createCommentDto, CancellationToken cancellationToken = default)
        {
            var game = await _gameRepository.GetItemAsync(gameId, cancellationToken);

            if (game is null)
            {
                throw new NotFoundException($"Game with ID {gameId} not found.");
            }

            var comment = new Comment
            {
                GameId = game.Id,
                UserId = createCommentDto.UserId,
                Content = createCommentDto.Content,
                Username = createCommentDto.Username,
                ProfileImageUrl = createCommentDto.ProfileImageUrl,
            };

            await _commentRepository.CreateAsync(comment, cancellationToken);
            return comment.Id;
        }

        public async Task<int> DeleteCommentAsync(int commentId, CancellationToken cancellationToken = default)
        {
            await _commentRepository.DeleteAsync(commentId, cancellationToken);
            return commentId;
        }

        public async Task<IEnumerable<Comment>> GetAllActiveGamesAsync(int gameId, CancellationToken cancellationToken = default)
        {
            var game = await _gameRepository.GetItemAsync(gameId, cancellationToken);

            if (game is null)
            {
                throw new NotFoundException($"Game with ID {gameId} not found.");
            }

            var comments = await _commentRepository.GetElementsAsync(cancellationToken);
            return comments.Where(c => c.GameId == game.Id);
        }
    }
}
