namespace BusinessLogicLayer.Services.DTOs
{
    public class UpdateGameDto
    {
        public string GameName { get; set; } = null!;
        public int MaxPlayers { get; set; }
        public string DifficultyLevel { get; set; } = null!;
        public bool IsActive { get; set; }
    }
}
