using BusinessLogicLayer.Exceptions;
using BusinessLogicLayer.Hubs;
using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Models;
using DataAccessLayer.Utils;
using Microsoft.AspNetCore.SignalR;
using StackExchange.Redis;
using System.Text.Json;

namespace BusinessLogicLayer.Services
{
    public class GameService : IGameService
    {
        private readonly IRepository<Game> _gameRepository;
        private readonly IRepository<Player> _playerRepository;
        private readonly IRepository<CompletedAnswer> _completedAnswerRepository;
        private readonly IRepository<GameStatus> _gameStatusRepository;
        private readonly IHubContext<GameHub> _gameHub;
        private readonly IConnectionMultiplexer _redis;

        public GameService(
            IRepository<Game> gameRepository,
            IRepository<Player> playerRepository,
            IRepository<CompletedAnswer> completedAnswerRepository,
            IRepository<GameStatus> gameStatusRepository,
            IHubContext<GameHub> gameHub,
            IConnectionMultiplexer redis)
        {
            _gameRepository = gameRepository;
            _playerRepository = playerRepository;
            _completedAnswerRepository = completedAnswerRepository;
            _gameStatusRepository = gameStatusRepository;
            _gameHub = gameHub;
            _redis = redis;
        }

        public async Task<int> CreateGameRoomAsync(CreateGameRoomDto createGameRoomDto, CancellationToken cancellationToken = default)
        {
            var random = new Random();
            int randomImageIndex = random.Next(1, 11);
            string randomCoverUrl = $"https://localhost:7292/covers/{randomImageIndex}.jpg";

            var gameStatus = await _gameStatusRepository.GetElementsAsync(cancellationToken);
            var notStartedStatus = gameStatus.FirstOrDefault(s => s.Name.Equals("Not started", StringComparison.OrdinalIgnoreCase));

            if (notStartedStatus is null)
            {
                throw new InvalidOperationException("Статус 'Not started' не найден в базе данных.");
            }

            var game = new Game
            {
                GameName = createGameRoomDto.GameName,
                HostId = createGameRoomDto.HostId,
                MaxPlayers = createGameRoomDto.MaxPlayers,
                GameCoverImageUrl = randomCoverUrl,
                GameStatusId = notStartedStatus.Id,
                CreateTime = DateTime.Now,
            };

            await _gameRepository.CreateAsync(game, cancellationToken);
            await _gameHub.Clients.All.SendAsync("GameCreated", game.GameName, cancellationToken);

            return game.Id;
        }

        public async Task<GameDto> GetGameByIdAsync(int gameId, CancellationToken cancellationToken = default)
        {
            var game = await _gameRepository.GetItemAsync(gameId, cancellationToken);

            if (game is null)
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
                Questions = game.Questions,
                Comments = game.Comments,
                Players = game.Players,
                CompletedAnswers = game.CompletedAnswers
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
                filteredGames = allGames.Where(g => !g.IsPrivate && g.Status.Name.Equals("Not started", StringComparison.OrdinalIgnoreCase));
            }
            else if (availability == GameStatusEnum.Private)
            {
                filteredGames = allGames.Where(g => g.IsPrivate && g.Status.Name.Equals("Not started", StringComparison.OrdinalIgnoreCase));
            }
            else if (availability == GameStatusEnum.Completed)
            {
                filteredGames = allGames.Where(g => g.Status.Name.Equals("Completed", StringComparison.OrdinalIgnoreCase));
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

            if (game is null)
            {
                throw new NotFoundException($"Game with ID {gameId} not found.");
            }

            if (game.Questions is null || !game.Questions.Any())
            {
                throw new NotFoundGameQuestionsException("Cannot start a game without any questions.");
            }

            var gameStatus = await _gameStatusRepository.GetElementsAsync(cancellationToken);
            var inProcessingStatus = gameStatus.FirstOrDefault(s => s.Name.Equals("In process", StringComparison.OrdinalIgnoreCase));

            if (inProcessingStatus is null)
            {
                throw new InvalidOperationException("No status found for StatusName 'Not started'");
            }

            var db = _redis.GetDatabase();
            string gameKey = $"game:{gameId}:players";
            var playersInGame = await db.ListRangeAsync(gameKey);
            var playerList = playersInGame.Select(p => JsonSerializer.Deserialize<PlayerDto>(p)).ToList();

            game.Players = playerList.Select(p => new Player
            {
                UserId = int.Parse(p.UserId),
                Name = p.Username,
                GameId = p.GameId,
            }).ToList();

            game.GameStatusId = inProcessingStatus.Id;
            game.StartTime = DateTime.Now;

            await _gameRepository.UpdateAsync(gameId, game, cancellationToken);

            var result = new StartedGameDto(game);

            await _gameHub.Clients.All.SendAsync("GameStarted", result, cancellationToken);

            return result;
        }

        public async Task CompleteGameAsync(int gameId, CancellationToken cancellationToken = default)
        {
            var db = _redis.GetDatabase();

            // Извлекаем информацию об игре из базы данных
            var game = await _gameRepository.GetItemAsync(gameId, cancellationToken);
            if (game is null)
            {
                throw new NotFoundException($"Game with ID {gameId} not found.");
            }

            // Проверяем, что игра в процессе и готова к завершению
            if (game.Status.Name != "In process")
            {
                throw new InvalidOperationException("Game is not in process and cannot be completed.");
            }

            // Извлекаем ответы игроков из Redis
            string answersPattern = $"running:game:{gameId}:answers:*";
            var server = _redis.GetServer(_redis.GetEndPoints().First());
            var keys = server.Keys(pattern: answersPattern);

            foreach (var key in keys)
            {
                var userAnswersJson = await db.StringGetAsync(key);
                var currentGameId = int.Parse(key.ToString().Split(':')[2]);
                if (userAnswersJson.HasValue)
                {
                    var userAnswers = JsonSerializer.Deserialize<List<AnswerSubmitedDto>>(userAnswersJson);

                    foreach (var answer in userAnswers)
                    {
                        // Определяем, правильный ли ответ
                        var isCorrect = game.Questions
                            .FirstOrDefault(q => q.Id == answer.QuestionId)?
                            .AnswerOptions.FirstOrDefault(opt => opt.Id == answer.AnswerId)?.IsCorrect ?? false;

                        var completedAnswer = new CompletedAnswer
                        {
                            GameId = gameId,
                            PlayerId = _playerRepository.GetElementsAsync(cancellationToken).Result.FirstOrDefault(x =>
                                x.GameId == currentGameId && x.UserId == int.Parse(key.ToString().Split(':').Last())).Id,
                            QuestionId = answer.QuestionId,
                            SelectedOptionId = answer.AnswerId,
                            IsCorrect = isCorrect
                        };

                        // Сохраняем каждый ответ в базе данных
                        await _completedAnswerRepository.CreateAsync(completedAnswer, cancellationToken);
                    }
                }
            }

            // Обновляем статус игры на "Completed"
            var gameStatuses = await _gameStatusRepository.GetElementsAsync(cancellationToken);
            var completedStatus = gameStatuses.FirstOrDefault(s => s.Name.Equals("Completed", StringComparison.OrdinalIgnoreCase));
            if (completedStatus is null)
            {
                throw new InvalidOperationException("Status 'Completed' not found in database.");
            }

            game.GameStatusId = completedStatus.Id;
            game.EndTime = DateTime.Now;
            await _gameRepository.UpdateAsync(gameId, game, cancellationToken);

            // Уведомляем клиентов об окончании игры
            await _gameHub.Clients.Group(gameId.ToString()).SendAsync("GameCompleted", gameId, game);
        }
    }
}
