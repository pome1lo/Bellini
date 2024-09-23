namespace BusinessLogicLayer.Services.DTOs
{
    public class ResetPasswordDto
    {
        public int UserId { get; set; }
        public string NewPassword { get; set; } = null!;
        public string VerificationCode { get; set; } = null!;
    }
}
