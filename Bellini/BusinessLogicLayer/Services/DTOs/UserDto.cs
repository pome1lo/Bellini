namespace DataAccessLayer.Services.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string? Username { get; set; }
        public string Email { get; set; } = null!;
        public string? Password { get; set; }
        public string? RegistrationCode { get; set; }
        public DateTime? VerificationCodeExpiry { get; set; }
    }
}
