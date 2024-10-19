namespace DataAccessLayer.Models
{
    public class Quiz : BaseModel
    {
        public int Id { get; set; }
        public string GameName { get; set; } = null!;
        public string GameCoverImageUrl { get; set; } = null!;
        public DateTime StartTime { get; set; } = DateTime.MinValue;
        public DateTime EndTime { get; set; } = DateTime.MinValue;
        public List<Question> Questions { get; set; } = null!;
        public List<QuizResults> QuizResults { get; set; } = null!;
    }
}
