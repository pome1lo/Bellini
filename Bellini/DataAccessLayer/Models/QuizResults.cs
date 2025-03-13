using System.Text.Json.Serialization;

namespace DataAccessLayer.Models
{
    public class QuizResults : BaseModel
    {
        public int NumberOfCorrectAnswers { get; set; } = 0;
        public int NumberOfQuestions { get; set; } = 0;
        public int UserId { get; set; }
        public DateTime EndTime { get; set; } = DateTime.Now;
        [JsonIgnore] public User User { get; set; } = null!;
        public int QuizId { get; set; }
        [JsonIgnore] public Quiz Quiz { get; set; } = null!;
    }
}
