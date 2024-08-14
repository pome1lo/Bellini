using BusinessLogicLayer.Services;
using BusinessLogicLayer.Services.DTOs;

namespace BusinessLogicLayer
{
    public class NotificationServiceTests
    {
        private NotificationService _notificationService;
        private BaseEmailNotificationDto _dto;

        [SetUp]
        public void Setup()
        {
            _notificationService = new NotificationService();
            _dto = new BaseEmailNotificationDto()
            { 
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