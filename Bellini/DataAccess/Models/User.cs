namespace DataAccess.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string RegistrationCode { get; set; } = null!;
        public string VerificationCode { get; set; } = null!;
    }
}
