namespace DataAccessLayer.Models
{
    public class QuizQuestion : BaseModel
    {
        public int Id { get; set; }
        public string Text { get; set; } = null!;
        public int QuizId { get; set; }
        public Quiz Quiz { get; set; } = null!;
        public List<QuizAnswerOption> AnswerOptions { get; set; } = new List<QuizAnswerOption>();
    }
}
