namespace BusinessLogicLayer.Services.DTOs
{
    public class CreateGameRoomDto
    {
        public string GameName { get; set; } = null!;
        public int HostId { get; set; }
        public DateTime CreateTime { get; set; } = DateTime.Now;
        public DateTime? StartTime { get; set; }
        public int MaxPlayers { get; set; }
        public string DifficultyLevel { get; set; } = null!;
        public bool IsPrivate { get; set; } = false;
        public string RoomPassword { get; set; } = "";
    }
}
