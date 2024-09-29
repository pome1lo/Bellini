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
        public bool IsActive { get; set; }
        public string DifficultyLevel { get; set; } = null!;
        public List<Player> Players { get; set; } = null!;
        public List<Comment> Comments { get; set; } = null!;
        public List<Category> Categories { get; set; } = null!;
    }
}
