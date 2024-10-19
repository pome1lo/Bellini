using DataAccess.Models;

namespace DataAccessLayer.Models
{
    public class QuizResults : BaseModel
    {
        public int Id { get; set; }
        public int NumberOfCorrectAnswers { get; set; } = 0;
        public int NumberOfQuestions { get; set; } = 0;
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public int QuizId { get; set; }
        public Quiz Quiz { get; set; } = null!;
    }
}
