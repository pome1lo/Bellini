using BusinessLogicLayer.Services;
using BusinessLogicLayer.Services.DTOs;

namespace BusinessLogicLayer
{
    public class NotificationServiceTest
    {
        private NotificationService _notificationService;
        private BaseEmailNotificationDto _dto;

        [SetUp]
        public void Setup()
        {
            _notificationService = new NotificationService();
            _dto = new BaseEmailNotificationDto()
            {
                SmtpPort = 465,
                SmtpServer = "smtp.mail.ru",
                Username = "",
                Password = "",
                Email = "",
                Subject = "test",
                Body = "test"
            };
        }

        [Test]
        public async Task SendEmailNotificationAsync()
        {
            try
            {
                await _notificationService.SendEmailNotificationAsync(_dto);
                
                Assert.True(true);
            }
            catch
            {
                Assert.True(false);
            }
        }
    }
}