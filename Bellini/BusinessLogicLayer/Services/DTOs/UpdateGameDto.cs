namespace BusinessLogicLayer.Services.DTOs
{
    public class UpdateGameDto
    {
        public string GameName { get; set; } = null!;
        public DateTime? StartTime { get; set; }
        public int? MaxPlayers { get; set; }
        public bool? IsActive { get; set; }
    }
}
