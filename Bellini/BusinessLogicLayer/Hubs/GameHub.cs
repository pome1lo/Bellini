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
    }
}
