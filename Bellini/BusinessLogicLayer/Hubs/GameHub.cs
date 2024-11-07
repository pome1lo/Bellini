using BusinessLogicLayer.Services.DTOs;
using Microsoft.AspNetCore.SignalR;
using StackExchange.Redis;
using System.Text.Json;

namespace BusinessLogicLayer.Hubs
{
    public class GameHub : Hub
    {
        private readonly IConnectionMultiplexer _redis;

        public GameHub(IConnectionMultiplexer redis)
        {

            _redis = redis;
        }

        public async Task NextQuestion(string gameId, int nextQuestionIndex)
        {
            await Clients.Group(gameId).SendAsync("NextQuestion", nextQuestionIndex);
        }

        public async Task SubmitAnswers(string gameId, string userId, List<AnswerSubmitedDto> answers)
        {
            try
            {
                var db = _redis.GetDatabase();
                string answersKey = $"running:game:{gameId}:answers:{userId}";

                var serializedAnswers = JsonSerializer.Serialize(answers);
                await db.StringSetAsync(answersKey, serializedAnswers);

                Console.WriteLine($"Answers saved for user {userId} in game {gameId}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in SubmitAnswers: {ex.Message}");
                throw;
            }
        }

        //public async Task EndGame(string gameId)
        //{
        //    await Clients.Group(gameId).SendAsync("GameEnded");
        //}

        public async Task JoinRunningGame(string gameId)
        {
            try
            {
                var db = _redis.GetDatabase();
                string gameKey = $"running:game:{gameId}:players";

                var playersInGame = await db.ListRangeAsync(gameKey);
                var playerList = playersInGame.Select(p => JsonSerializer.Deserialize<PlayerDto>(p)).ToList();

                await Groups.AddToGroupAsync(Context.ConnectionId, gameId);

                await Clients.Caller.SendAsync("PlayersList", playerList);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in JoinRunningGame: {ex.Message}");
                throw;
            }
        }

        public async Task JoinGame(JoinGameDto joinGameDto)
        {
            try
            {
                var db = _redis.GetDatabase();
                string gameKey = $"game:{joinGameDto.GameId}:players";

                var playersInGame = await db.ListRangeAsync(gameKey);
                var existingPlayers = playersInGame.Select(p => JsonSerializer.Deserialize<PlayerDto>(p)).ToList();

                if (existingPlayers.Any(p => p.UserId == joinGameDto.UserId))
                {
                    return;
                }

                var playerInfo = new PlayerDto
                {
                    UserId = joinGameDto.UserId,
                    Username = joinGameDto.Username,
                    Email = joinGameDto.Email,
                    ProfileImageUrl = joinGameDto.ProfileImageUrl
                };

                var serializedPlayer = JsonSerializer.Serialize(playerInfo);
                await db.ListRightPushAsync(gameKey, serializedPlayer);

                playersInGame = await db.ListRangeAsync(gameKey);
                var playerList = playersInGame.Select(p => JsonSerializer.Deserialize<PlayerDto>(p)).ToList();

                await Groups.AddToGroupAsync(Context.ConnectionId, joinGameDto.GameId);

                await Clients.Group(joinGameDto.GameId).SendAsync("PlayerJoined", playerList, joinGameDto);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in JoinGame: {ex.Message}");
                throw;
            }
        }

        public async Task LeaveGame(string gameId, string userId)
        {
            try
            {
                var db = _redis.GetDatabase();
                string gameKey = $"game:{gameId}:players";

                var playersInGame = await db.ListRangeAsync(gameKey);
                var playerList = playersInGame.Select(p => JsonSerializer.Deserialize<PlayerDto>(p)).ToList();

                var playerToRemove = playerList.FirstOrDefault(p => p.UserId == userId);
                if (playerToRemove is not null)
                {
                    var serializedPlayer = JsonSerializer.Serialize(playerToRemove);
                    await db.ListRemoveAsync(gameKey, serializedPlayer);
                }

                await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameId);

                playersInGame = await db.ListRangeAsync(gameKey);
                playerList = playersInGame.Select(p => JsonSerializer.Deserialize<PlayerDto>(p)).ToList();

                await Clients.Group(gameId).SendAsync("PlayerLeft", playerList);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in LeaveGame: {ex.Message}");
                throw;
            }
        }

        public async Task<List<PlayerDto>> GetPlayers(string gameId)
        {
            var db = _redis.GetDatabase();
            string gameKey = $"game:{gameId}:players";

            var playersInGame = await db.ListRangeAsync(gameKey);
            var playerList = playersInGame.Select(p => JsonSerializer.Deserialize<PlayerDto>(p)).ToList();

            return playerList;
        }
    }
}
