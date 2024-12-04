namespace DataAccessLayer.Services.DTOs
{
    public class AnswerDto
    {
        public int Id { get; set; }
        public string Text { get; set; } = null!;
        public bool IsCorrect { get; set; }
    }
}
