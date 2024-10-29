using DataAccess.Models;

namespace DataAccessLayer.Models
{
    public class CompletedAnswer : BaseModel
    {
        public int Id { get; set; }
        public int GameId { get; set; }
        public int PlayerId { get; set; }
        public int QuestionId { get; set; }
        public int SelectedOptionId { get; set; }
        public bool IsCorrect { get; set; }      

        public Game Game { get; set; } = null!;  
        public Player Player { get; set; } = null!;
        public Question Question { get; set; } = null!; 
        public AnswerOption SelectedOption { get; set; } = null!;
    }
}
