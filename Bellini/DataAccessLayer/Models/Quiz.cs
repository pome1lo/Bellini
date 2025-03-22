namespace DataAccessLayer.Models
{
    public class Quiz : BaseModel
    {
        public string GameName { get; set; } = null!;
        public string GameCoverImageUrl { get; set; } = null!;
        public bool IsDraft { get; set; } = false;
        public DateTime StartTime { get; set; } = DateTime.MinValue;
        public DateTime EndTime { get; set; } = DateTime.MinValue;
        public List<QuizQuestion> Questions { get; set; } = null!;
        public List<QuizResults> QuizResults { get; set; } = null!;
        public List<QuizComment> Comments { get; set; } = null!;
    }
}
