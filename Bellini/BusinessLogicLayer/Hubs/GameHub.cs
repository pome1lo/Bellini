using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Models;
using Microsoft.AspNetCore.SignalR;
using StackExchange.Redis;
using System.Text.Json;

namespace BusinessLogicLayer.Hubs
{
    public class GameHub : Hub
    {
        private readonly IConnectionMultiplexer _redis;
        private IRepository<User> _userRepository;

        public GameHub(IConnectionMultiplexer redis, IRepository<User> userRepository)
        {

            _redis = redis;
            _userRepository = userRepository;
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
                await Clients.All.SendAsync("GetPlayers", joinGameDto.GameId, playerList);
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
                await Clients.All.SendAsync("GetPlayers", gameId, playerList);
                await Clients.Group(gameId).SendAsync("PlayerLeft", playerList);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in LeaveGame: {ex.Message}");
                throw;
            }
        }

        public async Task GetPlayers(string gameId)
        {
            var db = _redis.GetDatabase();
            string gameKey = $"game:{gameId}:players";

            var playersInGame = await db.ListRangeAsync(gameKey);
            var playerList = playersInGame.Select(p => JsonSerializer.Deserialize<PlayerDto>(p)).ToList();

            await Clients.All.SendAsync("GetPlayers", gameId, playerList);
        }



        public async Task SendMessage(string gameId, string userId, string message, string hostId)
        {
            try
            {
                var db = _redis.GetDatabase();
                string gameKey = $"game:{gameId}:players";
                string chatKey = $"chat:{gameId}:messages";

                // Проверяем, есть ли пользователь в списке участников лобби
                var playersInGame = await db.ListRangeAsync(gameKey);
                var playerList = playersInGame.Select(p => JsonSerializer.Deserialize<PlayerDto>(p)).ToList();

                if (userId != hostId && !playerList.Any(p => p.UserId == userId))
                {
                    throw new HubException("You are not part of this lobby.");
                }

                User userHost = new();

                if (userId == hostId)
                {
                    userHost = await _userRepository.GetItemAsync(int.Parse(hostId));
                }

                var chatMessage = new
                {
                    UserId = userId,
                    ProfileImageUrl = (userId != hostId ? playerList.First(p => p.UserId == userId).ProfileImageUrl : userHost.ProfileImageUrl) ,
                    Username = (userId != hostId ? playerList.First(p => p.UserId == userId).Username : userHost.Username),
                    Message = message,
                    Timestamp = DateTime.UtcNow
                };

                var serializedMessage = JsonSerializer.Serialize(chatMessage);
                await db.ListRightPushAsync(chatKey, serializedMessage);
                 
                chatKey = $"chat:{gameId}:messages";

                var messages = await db.ListRangeAsync(chatKey);
                var chatHistory = messages.Select(m => JsonSerializer.Deserialize<object>(m)).ToList();
                await Clients.All.SendAsync("ChatHistory", gameId, chatHistory);
                await Clients.Group(gameId).SendAsync("ReceiveMessage", gameId, chatMessage);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in SendMessage: {ex.Message}");
                throw;
            }
        }

        public async Task GetChatHistory(string gameId)
        {
            var db = _redis.GetDatabase();
            string chatKey = $"chat:{gameId}:messages";

            var messages = await db.ListRangeAsync(chatKey);
            var chatHistory = messages.Select(m => JsonSerializer.Deserialize<object>(m)).ToList();

            //await Clients.Caller.SendAsync("ChatHistory", gameId, chatHistory);
            await Clients.All.SendAsync("ChatHistory", gameId, chatHistory);
        }

        public async Task ClearChat(string gameId)
        {
            var db = _redis.GetDatabase();
            string chatKey = $"chat:{gameId}:messages";

            await db.KeyDeleteAsync(chatKey);
        }
    }
}