namespace BusinessLogic.DTO
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string RegistrationCode { get; set; }
        public string VerificationCode { get; set; }
    }
}
