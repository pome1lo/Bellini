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

                // Добавляем игрока в Redis
                var playerInfo = JsonSerializer.Serialize(new
                {
                    joinGameDto.UserId,
                    joinGameDto.Username,
                    joinGameDto.Email,
                    joinGameDto.ProfileImageUrl
                });

                // Добавляем игрока в список игроков игровой комнаты
                await db.ListRightPushAsync(gameKey, playerInfo);

                // Получаем всех подключенных игроков в игровой комнате
                var playersInGame = await db.ListRangeAsync(gameKey);
                var playerList = playersInGame.Select(p => JsonSerializer.Deserialize<PlayerDto>(p)).ToList();

                // Присоединяем игрока к группе в SignalR
                await Groups.AddToGroupAsync(Context.ConnectionId, joinGameDto.GameId);

                // Отправляем всем игрокам список подключенных игроков и информацию о новом игроке
                await Clients.Group(joinGameDto.GameId).SendAsync("PlayerJoined", playerList, joinGameDto);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in JoinGame: {ex.Message}");
                throw;
            }
        }

        public async Task LeaveGame(string gameId)
        {
            try
            {
                var db = _redis.GetDatabase();
                string gameKey = $"game:{gameId}:players";

                // Удаляем игрока из Redis по ConnectionId
                // (в реальной системе можно добавить привязку ConnectionId к UserId для корректного удаления)
                await db.ListRemoveAsync(gameKey, Context.ConnectionId);

                // Обновляем список игроков
                var playersInGame = await db.ListRangeAsync(gameKey);
                var playerList = playersInGame.Select(p => JsonSerializer.Deserialize<PlayerDto>(p)).ToList();

                // Удаляем игрока из группы SignalR
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameId);

                // Уведомляем остальных игроков о выходе
                await Clients.Group(gameId).SendAsync("PlayerLeft", playerList);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in LeaveGame: {ex.Message}");
                throw;
            }
        }
    }
}
