using BusinessLogic.Exceptions; // Добавлено для исключений
using BusinessLogicLayer.Exceptions;
using BusinessLogicLayer.Hubs;
using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using DataAccess.Data.Interfaces;
using DataAccess.Models;
using DataAccessLayer.Models;
using Microsoft.AspNetCore.SignalR;

namespace BusinessLogicLayer.Services
{
    public class GameService : IGameService
    {
        private readonly IRepository<Game> _gameRepository;
        private readonly IRepository<Player> _playerRepository;
        private readonly IRepository<Comment> _commentRepository;
        private readonly IRepository<GameStatus> _gameStatusRepository;
        private readonly IHubContext<GameHub> _gameHub;

        public GameService(
            IRepository<Game> gameRepository,
            IRepository<Player> playerRepository,
            IRepository<Comment> commentRepository,
            IRepository<GameStatus> gameStatusRepository,
            IHubContext<GameHub> gameHub)
        {
            _gameRepository = gameRepository;
            _playerRepository = playerRepository;
            _commentRepository = commentRepository;
            _gameStatusRepository = gameStatusRepository;
            _gameHub = gameHub;
        }

        public async Task<int> CreateGameRoomAsync(CreateGameRoomDto createGameRoomDto, CancellationToken cancellationToken = default)
        {
            var random = new Random();
            int randomImageIndex = random.Next(1, 11);
            string randomCoverUrl = $"https://localhost:7292/covers/{randomImageIndex}.jpg";

            var gameStatus = await _gameStatusRepository.GetElementsAsync(cancellationToken);
            var notStartedStatus = gameStatus.FirstOrDefault(s => s.Name.Equals("Not started", StringComparison.OrdinalIgnoreCase));

            if (notStartedStatus == null)
            {
                throw new InvalidOperationException("Статус 'Not started' не найден в базе данных.");
            }

            var game = new Game
            {
                GameName = createGameRoomDto.GameName,
                HostId = createGameRoomDto.HostId,
                MaxPlayers = createGameRoomDto.MaxPlayers,
                GameCoverImageUrl = randomCoverUrl,
                GameStatusId = notStartedStatus.Id
            };

            await _gameRepository.CreateAsync(game, cancellationToken);
            await _gameHub.Clients.All.SendAsync("GameCreated", game.GameName, cancellationToken);

            return game.Id;
        }


        public async Task<GameDto> GetGameByIdAsync(int gameId, CancellationToken cancellationToken = default)
        {
            var game = await _gameRepository.GetItemAsync(gameId, cancellationToken);

            if (game == null)
            {
                throw new NotFoundException($"Game with ID {gameId} not found.");
            }

            return new GameDto
            {
                Id = game.Id,
                GameName = game.GameName,
                HostId = game.HostId,
                StartTime = game.StartTime,
                MaxPlayers = game.MaxPlayers,
                GameStatus = game.Status,
                GameCoverImageUrl = game.GameCoverImageUrl,
                IsPrivate = game.IsPrivate,
                RoomPassword = game.RoomPassword,
            };
        }

        public async Task<IEnumerable<GameDto>> GetAllActiveGamesAsync(CancellationToken cancellationToken = default)
        {
            var games = await _gameRepository.GetElementsAsync(cancellationToken);
            return games
                .Where(g => g.Status.Name.Equals("Not started", StringComparison.OrdinalIgnoreCase))
                .Select(g => new GameDto
                {
                    Id = g.Id,
                    GameName = g.GameName,
                    HostId = g.HostId,
                    StartTime = g.StartTime,
                    MaxPlayers = g.MaxPlayers,
                    GameStatus = g.Status,
                    IsPrivate = g.IsPrivate,
                    RoomPassword = g.RoomPassword,
                    GameCoverImageUrl = g.GameCoverImageUrl
                }).ToList();
        }

        public async Task<IEnumerable<GameDto>> SelectGamesByStatusNameAsync(string statusName, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(statusName))
            {
                throw new NotFoundException($"Game status with name {statusName} not found.");
            }

            var games = await _gameRepository.GetElementsAsync(cancellationToken);
            var filteredGames = games
                .Where(game => game.Status.Name.Equals(statusName, StringComparison.OrdinalIgnoreCase))
                .Select(game => new GameDto
                {
                    Id = game.Id,
                    GameName = game.GameName,
                    HostId = game.HostId,
                    StartTime = game.StartTime,
                    MaxPlayers = game.MaxPlayers,
                    GameStatus = game.Status,
                    IsPrivate = game.IsPrivate,
                    RoomPassword = game.RoomPassword,
                    GameCoverImageUrl = game.GameCoverImageUrl
                }).ToList();

            if (!filteredGames.Any())
            {
                throw new NoContentException($"No games found for status {statusName}.");
            }

            return filteredGames;
        }

        public async Task<StartedGameDto> StartGame(int gameId, StartGameDto startGameDto, CancellationToken cancellationToken = default)
        {
            var game = await _gameRepository.GetItemAsync(gameId, cancellationToken);

            if (game == null)
            {
                throw new NotFoundException($"Game with ID {gameId} not found.");
            }

            var gameStatus = await _gameStatusRepository.GetElementsAsync(cancellationToken);
            var inProcessingStatus = gameStatus.FirstOrDefault(s => s.Name.Equals("In process", StringComparison.OrdinalIgnoreCase));

            if (inProcessingStatus == null)
            {
                throw new InvalidOperationException("No status found for StatusName 'Not started'");
            }

            game.Players = startGameDto.Players;
            game.GameStatusId = inProcessingStatus.Id;
            game.StartTime = DateTime.Now;

            await _gameRepository.UpdateAsync(gameId, game, cancellationToken);

            return new StartedGameDto();
        }

        //public async Task UpdateGameAsync(int gameId, UpdateGameDto updateGameDto, CancellationToken cancellationToken = default)
        //{
        //    var game = await _gameRepository.GetItemAsync(gameId, cancellationToken);

        //    if (game == null)
        //    {
        //        throw new NotFoundException($"Game with ID {gameId} not found.");
        //    }

        //    game.GameName = updateGameDto.GameName;
        //    game.MaxPlayers = updateGameDto.MaxPlayers;
        //    game.DifficultyLevel = updateGameDto.DifficultyLevel;
        //    game.IsActive = updateGameDto.IsActive;

        //    await _gameRepository.UpdateAsync(gameId, game, cancellationToken);
        //}

        //public async Task EndGameAsync(int gameId, CancellationToken cancellationToken = default)
        //{
        //    var game = await _gameRepository.GetItemAsync(gameId, cancellationToken);

        //    if (game == null)
        //    {
        //        throw new NotFoundException($"Game with ID {gameId} not found.");
        //    }

        //    game.IsActive = false;

        //    await _gameRepository.UpdateAsync(gameId, game, cancellationToken);

        //    // Уведомление игроков об окончании игры
        //    await _gameHub.Clients.Group($"game-{gameId}").SendAsync("GameEnded", gameId, cancellationToken);
        //}

        //public async Task JoinGameAsync(int gameId, int playerId, CancellationToken cancellationToken = default)
        //{
        //    var game = await _gameRepository.GetItemAsync(gameId, cancellationToken);

        //    if (game == null)
        //    {
        //        throw new NotFoundException($"Game with ID {gameId} not found.");
        //    }

        //    var player = new Player
        //    {
        //        GameId = gameId,
        //        Id = playerId
        //    };

        //    await _playerRepository.CreateAsync(player, cancellationToken);

        //    // Присоединение игрока к группе (игровой комнате)
        //    await _gameHub.Clients.Group($"game-{gameId}").SendAsync("PlayerJoined", playerId, cancellationToken);
        //}

        //public async Task LeaveGameAsync(int gameId, int playerId, CancellationToken cancellationToken = default)
        //{
        //    var player = await _playerRepository.GetItemAsync(playerId, cancellationToken);

        //    if (player == null)
        //    {
        //        throw new NotFoundException($"Player with ID {playerId} not found.");
        //    }

        //    if (player.GameId == gameId)
        //    {
        //        await _playerRepository.DeleteAsync(playerId, cancellationToken);

        //        // Уведомление об уходе игрока из игры
        //        await _gameHub.Clients.Group($"game-{gameId}").SendAsync("PlayerLeft", playerId, cancellationToken);
        //    }
        //}

        //public async Task AddCommentToGameAsync(int gameId, AddCommentDto addCommentDto, CancellationToken cancellationToken = default)
        //{
        //    var game = await _gameRepository.GetItemAsync(gameId, cancellationToken);

        //    if (game == null)
        //    {
        //        throw new NotFoundException($"Game with ID {gameId} not found.");
        //    }

        //    var comment = new Comment
        //    {
        //        GameId = gameId,
        //        Content = addCommentDto.Content,
        //        UserId = addCommentDto.CreatedBy,
        //        CommentDate = addCommentDto.CreatedAt
        //    };

        //    await _commentRepository.CreateAsync(comment, cancellationToken);
        //}

        //public async Task<IEnumerable<CommentDto>> GetCommentsForGameAsync(int gameId, CancellationToken cancellationToken = default)
        //{
        //    var comments = await _commentRepository.GetElementsAsync(cancellationToken);
        //    return comments.Where(c => c.GameId == gameId)
        //                   .Select(c => new CommentDto
        //                   {
        //                       Id = c.Id,
        //                       GameId = c.GameId,
        //                       Content = c.Content,
        //                       CreatedBy = c.UserId,
        //                       CreatedAt = c.CommentDate
        //                   });
        //}
    }
}
