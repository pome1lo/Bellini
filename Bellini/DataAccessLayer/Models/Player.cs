using System.Text.Json.Serialization;

namespace DataAccessLayer.Models
{
    public class Player : BaseModel
    {
        public int Id { get; set; }
        public int GameId { get; set; }
        public string Name { get; set; } = null!;
        public int Score { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        [JsonIgnore] public Game? Game { get; set; }
    }
}
