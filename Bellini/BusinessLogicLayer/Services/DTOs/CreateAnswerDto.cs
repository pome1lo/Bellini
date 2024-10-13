namespace BusinessLogicLayer.Services.DTOs
{
    public class CreateAnswerDto
    {
        public string Text { get; set; } = null!;
        public bool IsCorrect { get; set; }
    }
}
