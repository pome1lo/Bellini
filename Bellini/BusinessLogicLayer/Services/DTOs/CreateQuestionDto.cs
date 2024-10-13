namespace BusinessLogicLayer.Services.DTOs
{
    public class CreateQuestionDto
    {
        public string Text { get; set; } = null!;
        public int GameId { get; set; }
        public IEnumerable<CreateAnswerDto> Answers { get; set; } = null!;
    }
}
