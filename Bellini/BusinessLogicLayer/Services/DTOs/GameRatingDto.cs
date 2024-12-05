namespace BusinessLogicLayer.Services.DTOs
{
    public class GameRatingDto
    {
        public int Rank { get; set; } // Место игрока
        public string Username { get; set; } = null!;
        public string? ProfileImageUrl { get; set; } // Аватар пользователя
        public int CorrectAnswers { get; set; } // Количество правильных ответов
        public double Accuracy { get; set; } // Процент правильных ответов
    }
}
