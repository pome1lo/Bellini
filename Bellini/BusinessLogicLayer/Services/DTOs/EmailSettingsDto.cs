namespace DataAccessLayer.Services.DTOs
{
    public class EmailSettingsDto
    {
        public string SmtpServer { get; set; } = null!;
        public int SmtpPort { get; set; }
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
