using System.Text.Json.Serialization;

namespace DataAccessLayer.Models
{
    public class QuizQuestion : BaseModel
    {
        public string Text { get; set; } = null!;
        public int QuizId { get; set; }
        public string? QuizQuestionImageUrl { get; set; } = string.Empty;
        [JsonIgnore] public Quiz Quiz { get; set; } = null!;
        public List<QuizAnswerOption> AnswerOptions { get; set; } = null!;
    }
}
