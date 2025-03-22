namespace BusinessLogicLayer.Services.DTOs
{
    public class AdminCreateQuizDto
    {
        public string Name { get; set; } = string.Empty;
        public bool IsDraft { get; set; } = true;
    }
}
