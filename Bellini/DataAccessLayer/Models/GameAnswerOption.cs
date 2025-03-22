using System.Text.Json.Serialization;

namespace DataAccessLayer.Models
{
    public class GameAnswerOption : BaseModel
    {
        public string Text { get; set; } = null!;
        public bool IsCorrect { get; set; }
        public int QuestionId { get; set; }
        [JsonIgnore] public GameQuestion GameQuestion { get; set; } = null!;
    }
}
