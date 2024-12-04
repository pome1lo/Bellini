namespace BusinessLogicLayer.Services.DTOs
{
    public class QuizRatingDto
    {
        public int Rank { get; set; }          // Ранг игрока
        public string Username { get; set; }  // Имя пользователя
        public string Email { get; set; }     // Электронная почта
        public int CorrectAnswers { get; set; }  // Количество правильных ответов
        public int TotalQuestions { get; set; }  // Общее количество вопросов
        public double Accuracy { get; set; }     // Процент правильных ответов
        public DateTime EndTime { get; set; }    // Дата завершения
    }

}
