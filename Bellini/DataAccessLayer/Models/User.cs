namespace DataAccessLayer.Models
{
    public class User : BaseModel
    {
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string? Username { get; set; }
        public string? Password { get; set; }
        public bool IsEmailVerified { get; set; } = false;
        public bool IsActive { get; set; } = false;
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? ProfileImageUrl { get; set; }
        public List<Notification> Notifications { get; set; } = null!;
        public List<QuizResults> QuizResults { get; set; } = null!;
        public List<GameResults> GameResults { get; set; } = null!;
    }
}
