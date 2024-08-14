namespace BusinessLogicLayer.Services.DTOs
{
    public class ResetPasswordDto
    {
        public string UserId { get; set; } = null!;
        public string NewPassword { get; set; } = null!;
    }
}
