namespace DataAccessLayer.Services.DTOs
{
    public class QuizSessionDto
    {
        public int SessionId { get; set; }
        public int QuizId { get; set; }
        public int UserId { get; set; }
        public DateTime StartTime { get; set; }
        public bool IsCompleted { get; set; }
    }
}
