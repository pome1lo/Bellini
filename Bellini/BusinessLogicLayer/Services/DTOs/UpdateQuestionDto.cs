namespace BusinessLogicLayer.Services.DTOs
{
    public class UpdateQuestionDto
    {
        public string Text { get; set; } = null!;
        public IEnumerable<UpdateAnswerDto> Answers { get; set; } = null!;
    }
}
