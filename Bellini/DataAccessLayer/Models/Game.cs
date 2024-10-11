using DataAccessLayer.Models;

namespace DataAccess.Models
{
    public class Game
    {
        public int Id { get; set; }
        public string GameName { get; set; } = null!;
        public int HostId { get; set; }
        public DateTime StartTime { get; set; }
        public int MaxPlayers { get; set; }
        public string GameCoverImageUrl { get; set; } = null!;
        public bool IsPrivate { get; set; }
        public string RoomPassword { get; set; } = "";
        public int GameStatusId { get; set; }
        public GameStatus Status { get; set; } = null!;
        public List<Comment> Comments { get; set; } = null!;
        public List<Player> Players { get; set; } = null!;
    }
}
