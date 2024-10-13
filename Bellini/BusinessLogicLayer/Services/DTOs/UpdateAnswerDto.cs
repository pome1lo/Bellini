namespace BusinessLogicLayer.Services.DTOs
{
    public class UpdateAnswerDto
    {
        public string Text { get; set; } = null!;
        public bool IsCorrect { get; set; }
    }
}
