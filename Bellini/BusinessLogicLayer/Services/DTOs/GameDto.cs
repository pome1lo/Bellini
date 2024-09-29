namespace BusinessLogicLayer.Services.DTOs
{
    public class GameDto
    {
        public int GameId { get; set; }
        public string GameName { get; set; } = null!;
        public int HostId { get; set; }
        public DateTime StartTime { get; set; }
        public bool IsActive { get; set; }
        public int MaxPlayers { get; set; }
        public IEnumerable<PlayerDto> Players { get; set; } = null!;
    }
}
