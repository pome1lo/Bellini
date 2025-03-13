namespace BusinessLogicLayer.Services.DTOs
{
    public class UserStatisticsDto
    {
        public int UserId { get; set; }
        public int QuizzesCompleted { get; set; }
        public int GamesPlayed { get; set; }
        public int QuizComments { get; set; }
        public int GameComments { get; set; }
        public int QuizzesCreated { get; set; }
        public int QuestionsCreated { get; set; }
    }
}
