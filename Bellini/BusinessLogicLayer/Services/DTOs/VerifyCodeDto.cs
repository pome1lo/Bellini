namespace BusinessLogicLayer.Services.DTOs
{
    public class VerifyCodeDto
    {
        public string Email { get; set; } = null!;
        public string VerificationCode { get; set; } = null!;
    }
}
