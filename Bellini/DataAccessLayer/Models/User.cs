namespace DataAccess.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string? RegistrationCode { get; set; } = string.Empty;
        public string? VerificationCode { get; set; } = string.Empty;
        public DateTime? VerificationCodeExpiry { get; set; }
        public string? FirstName { get; set; } = null!;
        public string? LastName { get; set; } = null!; 
        public DateTime? DateOfBirth { get; set; } 
        public string? ProfileImageUrl { get; set; } 
    }
}
