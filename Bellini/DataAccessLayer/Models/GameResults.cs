using System.Text.Json.Serialization;

namespace DataAccessLayer.Models
{
    public class GameResults : BaseModel
    {
        public int NumberOfCorrectAnswers { get; set; } = 0;
        public int NumberOfQuestions { get; set; } = 0;
        public int UserId { get; set; }
        [JsonIgnore] public User User { get; set; } = null!;
        public int GameId { get; set; }
        [JsonIgnore] public Game Game { get; set; } = null!;
    }
}
