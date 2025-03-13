using System.Text.Json.Serialization;

namespace DataAccessLayer.Models
{
    public class UserStatistics : BaseModel
    {
        public int UserId { get; set; }
        [JsonIgnore] public User User { get; set; } = null!;
        public int ProfileEdits { get; set; } = default;
        public int AvatarsSet { get; set; } = default;
        public int QuizzesCompleted { get; set; } = default;
        public int GamesPlayed { get; set; } = default;
        public int QuizComments { get; set; } = default;
        public int GameComments { get; set; } = default;
        public int QuizzesCreated { get; set; } = default;
        public int GameCreated { get; set; } = default;
        public int QuestionsCreated { get; set; } = default;
    }
}
