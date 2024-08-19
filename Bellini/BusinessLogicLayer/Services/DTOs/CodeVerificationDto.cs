namespace BusinessLogicLayer.Services.DTOs
{
    public class CodeVerificationDto
    {
        public string Email { get; set; } = null!;
        public string RegistrationCode { get; set; } = null!;
    }
}
