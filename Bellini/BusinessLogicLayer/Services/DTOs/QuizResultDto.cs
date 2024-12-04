namespace DataAccessLayer.Services.DTOs
{
    public class QuizResultDto
    {
        public int TotalQuestions { get; set; }
        public int CorrectAnswers { get; set; }
        public DateTime EndTime { get; set; }
    }
}
