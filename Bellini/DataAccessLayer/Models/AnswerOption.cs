using System.Text.Json.Serialization;

namespace DataAccessLayer.Models
{
    public class AnswerOption : BaseModel
    {
        public int Id { get; set; }
        public string Text { get; set; } = null!;
        public bool IsCorrect { get; set; }
        public int QuestionId { get; set; }
        [JsonIgnore] public Question Question { get; set; } = null!;
    }
}
