using DataAccess.Models;

namespace DataAccessLayer.Models
{
    public class Player
    {
        public int Id { get; set; }
        public int GameId { get; set; }
        public string Name { get; set; } = null!;
        public int Score { get; set; }
        public Game Game { get; set; } = null!;
    }
}
