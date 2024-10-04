using Microsoft.AspNetCore.SignalR;

namespace BusinessLogicLayer.Hubs
{
    public class GameHub : Hub
    {
        // Метод для отправки сообщений конкретной группе пользователей (игрокам в комнате)
        public async Task SendMessageToGroup(string groupName, string message)
        {
            await Clients.Group(groupName).SendAsync("ReceiveMessage", message);
        }

        // Метод для присоединения пользователя к группе (игровой комнате)
        public async Task JoinGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }

        // Метод для выхода пользователя из группы
        public async Task LeaveGroup(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        }

        public async Task JoinGame(string gameId, string userId, string username)
        {
            // Логика добавления пользователя в игру
            Console.BackgroundColor = ConsoleColor.Magenta;
            Console.WriteLine("JOIN GAME " + userId);
            Console.BackgroundColor = ConsoleColor.White;
            await Groups.AddToGroupAsync(Context.ConnectionId, gameId);
            await Clients.Group(gameId).SendAsync("ReceiveMessage", username + " joined the game");
        }
    }
}
