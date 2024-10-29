using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataAccessLayer.Models
{
    public class CompletedAnswer : BaseModel
    {
        [Key] public int Id { get; set; }
        public int GameId { get; set; }
        public int PlayerId { get; set; }
        public int QuestionId { get; set; }
        public int SelectedOptionId { get; set; }
        public bool IsCorrect { get; set; }

        [ForeignKey("GameId")]
        public Game Game { get; set; } = null!;

        [ForeignKey("PlayerId")]
        public Player Player { get; set; } = null!;


        [ForeignKey("QuestionId")]
        public Question Question { get; set; } = null!;
        public AnswerOption SelectedOption { get; set; } = null!;
    }
}
