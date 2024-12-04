namespace BusinessLogicLayer.Services.DTOs
{
    public class QuizQuestionDto
    {
        public int QuestionId { get; set; }
        public string Text { get; set; } = null!;
        public List<AnswerOptionDto> AnswerOptions { get; set; } = new();
    }
}
