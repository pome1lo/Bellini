using DataAccessLayer.Models;

namespace BusinessLogicLayer.Services.DTOs
{
    public class GameDto
    {
        public int Id { get; set; }
        public string GameName { get; set; } = null!;
        public int HostId { get; set; }
        public DateTime CreateTime { get; set; } = DateTime.Now;
        public DateTime? StartTime { get; set; }
        public int MaxPlayers { get; set; }
        public string GameCoverImageUrl { get; set; } = null!;
        public bool IsPrivate { get; set; }
        public string RoomPassword { get; set; } = "";
        public GameStatus GameStatus { get; set; } = null!;
        public List<Question> Questions { get; set; } = null!;
        public List<GameComment> Comments { get; set; } = null!;
        public List<Player> Players { get; set; } = null!;
        public List<CompletedAnswer> CompletedAnswers { get; set; } = new();
    }
}
