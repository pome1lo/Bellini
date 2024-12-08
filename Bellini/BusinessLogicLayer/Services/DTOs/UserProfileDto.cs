namespace BusinessLogicLayer.Services.DTOs
{
    public class UserProfileDto
    {
        public int TotalQuizzesCompleted { get; set; }
        public int TotalGamesCompleted { get; set; }
        public double AverageQuizAccuracy { get; set; }
        public double AverageGameAccuracy { get; set; }
        public string? LastCompletedQuiz { get; set; }
        public string? LastCompletedGame { get; set; }
        public string? BestQuiz { get; set; }
        public string? BestGame { get; set; }
    }
}
