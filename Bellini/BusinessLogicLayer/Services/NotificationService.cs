using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using EmailSenderLibrary;

namespace BusinessLogicLayer.Services
{
    public class NotificationService : INotificationService
    {
        public async Task SendEmailNotificationAsync(BaseEmailNotificationDto notificationDto, CancellationToken cancellationToken = default)
        {
            var emailSender = new EmailSender(
                notificationDto.SmtpServer,
                notificationDto.SmtpPort,
                notificationDto.Username,
                notificationDto.Password
            );

            await emailSender.SendEmailAsync(
                "Bellini",
                notificationDto.Username,
                "", // Имя получателя
                notificationDto.Email,
                notificationDto.Subject,
                notificationDto.Body
            );
        }
    }
}
