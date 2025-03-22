namespace BusinessLogicLayer.Services.DTOs
{
    public class CreateQuizQuestionDto
    {
        public string Text { get; set; } = null!;
        public int QuizId { get; set; }
        public string? QuizQuestionImageUrl { get; set; }
        public IEnumerable<CreateAnswerDto> Answers { get; set; } = null!;
    }
}
