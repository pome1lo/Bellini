namespace BusinessLogicLayer.Services.DTOs
{
    public class BaseEmailNotificationDto
    {
        public string Email { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
    }
}
