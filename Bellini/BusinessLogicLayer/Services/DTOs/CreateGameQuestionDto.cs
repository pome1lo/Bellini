namespace BusinessLogicLayer.Services.DTOs
{
    public class CreateGameQuestionDto
    {
        public string Text { get; set; } = null!;
        public int GameId { get; set; }
        public string? QuestionImageUrl { get; set; }
        public IEnumerable<CreateAnswerDto> Answers { get; set; } = null!;
    }
}
