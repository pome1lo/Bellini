using BusinessLogic.Exceptions;
using BusinessLogicLayer.Hubs;
using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using DataAccess.Data.Interfaces;
using DataAccess.Models;
using DataAccessLayer.Models;
using DataAccessLayer.Utils;
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
                Questions = game.Questions
            };
        }

        public async Task<(IEnumerable<GameDto> Games, int TotalCount)> GetAllActiveGamesAsync(int limit, int offset, CancellationToken cancellationToken = default)
        {
            var allGames = await _gameRepository.GetElementsAsync(cancellationToken);
            var filteredGames = allGames
                .Where(g => g.Status.Name.Equals("Not started", StringComparison.OrdinalIgnoreCase));

            var totalCount = filteredGames.Count();
            var paginatedGames = filteredGames
                .Skip(offset)
                .Take(limit)
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
                })
                .ToList();

            return (paginatedGames, totalCount);
        }

        public async Task<(IEnumerable<GameDto> Games, int TotalCount)> SelectGamesByAvailabilityAsync(GameStatusEnum availability, int limit, int offset, CancellationToken cancellationToken = default)
        {
            var allGames = await _gameRepository.GetElementsAsync(cancellationToken);

            IEnumerable<Game> filteredGames;

            if (availability == GameStatusEnum.Public)
            {
                filteredGames = allGames.Where(g => !g.IsPrivate);
            }
            else if (availability == GameStatusEnum.Private)
            {
                filteredGames = allGames.Where(g => g.IsPrivate);
            }
            else if (availability == GameStatusEnum.Archived)
            {
                filteredGames = allGames.Where(g => g.Status.Name.Equals("Archived", StringComparison.OrdinalIgnoreCase));
            }
            else
            {
                throw new ArgumentOutOfRangeException(nameof(availability), $"Unsupported availability status: {availability}");
            }

            var totalCount = filteredGames.Count();
            var paginatedGames = filteredGames
                .Skip(offset)
                .Take(limit)
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
                })
                .ToList();

            return (paginatedGames, totalCount);
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
    }
}
