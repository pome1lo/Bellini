namespace BusinessLogicLayer.Services.DTOs
{
    public class QuizResultDto
    {
        public int QuizSessionId { get; set; }
        public int Score { get; set; }
        public int TotalQuestions { get; set; }
        public int CorrectAnswers { get; set; }
        public DateTime EndTime { get; set; }
    }
}
