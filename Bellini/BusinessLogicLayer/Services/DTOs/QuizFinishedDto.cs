namespace BusinessLogicLayer.Services.DTOs
{
    public class QuizFinishedDto
    {
        public int UserId { get; set; }
        public List<QuizUserAnswerDto> UserAnswers { get; set; }
    }
}
