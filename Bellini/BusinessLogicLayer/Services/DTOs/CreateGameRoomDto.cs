namespace BusinessLogicLayer.Services.DTOs
{
    public class CreateGameRoomDto
    {
        public string GameName { get; set; } = null!;
        public int HostId { get; set; }
        public DateTime StartTime { get; set; }
        public int MaxPlayers { get; set; }
        public string DifficultyLevel { get; set; } = null!;
    }
}
