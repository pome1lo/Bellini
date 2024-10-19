using System.Text.Json.Serialization;

namespace DataAccessLayer.Models
{
    public class QuizAnswerOption : BaseModel
    {
        public int Id { get; set; }
        public string Text { get; set; } = null!;
        public bool IsCorrect { get; set; }
        public int QuizQuestionId { get; set; }
        [JsonIgnore] public QuizQuestion QuizQuestion { get; set; } = null!;
    }
}
