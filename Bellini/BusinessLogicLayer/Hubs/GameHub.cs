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
                if (playerToRemove != null)
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
