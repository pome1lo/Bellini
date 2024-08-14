using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using BusinessLogicLayer.Utils;
using EmailSenderLibrary;

namespace BusinessLogicLayer.Services
{
    public class NotificationService : INotificationService
    {
        private readonly EmailSender _emailSender;
        private readonly EmailSettingsDto _emailSettingsDto = ConfigurationHelper.GetEmailSettings();

        public NotificationService()
        {
            _emailSettingsDto = ConfigurationHelper.GetEmailSettings();

            _emailSender = new EmailSender(
               _emailSettingsDto.SmtpServer,
               _emailSettingsDto.SmtpPort,
               _emailSettingsDto.Email,
               _emailSettingsDto.Password
            );
        }

        public async Task SendEmailNotificationAsync(BaseEmailNotificationDto notificationDto, CancellationToken cancellationToken = default)
        {
            await _emailSender.SendEmailAsync(
                _emailSettingsDto.Email,
                notificationDto.Email ?? _emailSettingsDto.Email,
                notificationDto.Subject,
                notificationDto.Body
            );
        }
    }
}
