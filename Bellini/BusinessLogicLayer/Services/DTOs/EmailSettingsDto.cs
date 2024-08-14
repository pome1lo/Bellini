namespace BusinessLogicLayer.Services.DTOs
{
    public class EmailSettingsDto
    {
        public string SmtpServer { get; set; }
        public int SmtpPort { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
