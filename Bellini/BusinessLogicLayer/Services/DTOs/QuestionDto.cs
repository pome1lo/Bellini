namespace DataAccessLayer.Services.DTOs
{
    public class QuestionDto
    {
        public int Id { get; set; }
        public string Text { get; set; } = null!;
        public int GameId { get; set; }
        public IEnumerable<AnswerDto> Answers { get; set; } = null!;
    }
}
