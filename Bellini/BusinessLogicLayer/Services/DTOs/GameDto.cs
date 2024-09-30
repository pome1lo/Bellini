namespace BusinessLogicLayer.Services.DTOs
{
    public class GameDto
    {
        public int Id { get; set; }
        public string GameName { get; set; } = null!;
        public int HostId { get; set; }
        public DateTime StartTime { get; set; }
        public int MaxPlayers { get; set; }
        public bool IsActive { get; set; }
        public string DifficultyLevel { get; set; }
    }
}
