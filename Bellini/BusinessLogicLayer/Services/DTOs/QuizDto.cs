namespace BusinessLogicLayer.Services.DTOs
{
    public class QuizDto
    {
        public int Id { get; set; }
        public string GameName { get; set; } = null!;
        public string GameCoverImageUrl { get; set; } = null!;
        public DateTime StartTime { get; set; } = DateTime.MinValue;
        public DateTime EndTime { get; set; } = DateTime.MinValue;
        public int NumberOfQuestions { get; set; } = 0;
        public bool HasUserCompleted { get; set; } = false;
        public bool IsDraft { get; set; } = false;
    }
}
