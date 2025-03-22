using System.Text.Json.Serialization;

namespace DataAccessLayer.Models
{
    public class GameQuestion : BaseModel
    {
        public string Text { get; set; } = null!;
        public int GameId { get; set; }
        [JsonIgnore] public Game Game { get; set; } = null!;
        public string? QuestionImageUrl { get; set; }
        public bool IsCustom { get; set; }
        public List<GameAnswerOption> AnswerOptions { get; set; } = new List<GameAnswerOption>();
    }
}
