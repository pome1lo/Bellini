namespace DataAccessLayer.Models
{
    public class Game : BaseModel
    {
        public int Id { get; set; }
        public string GameName { get; set; } = null!;
        public int HostId { get; set; }
        public DateTime CreateTime { get; set; } = DateTime.Now;
        public DateTime StartTime { get; set; } = DateTime.MinValue;
        public DateTime EndTime { get; set; } = DateTime.MinValue;
        public int MaxPlayers { get; set; }
        public string GameCoverImageUrl { get; set; } = null!;
        public bool IsPrivate { get; set; }
        public string RoomPassword { get; set; } = "";
        public int GameStatusId { get; set; }

        public GameStatus Status { get; set; } = null!;
        public List<GameComment> Comments { get; set; } = null!;
        public List<Player> Players { get; set; } = null!;
        public List<Question> Questions { get; set; } = null!;
        public List<GameResults> GameResults { get; set; } = null!;
    }
}
