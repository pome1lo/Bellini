using BusinessLogicLayer.Services.DTOs;

namespace BusinessLogicLayer.Services.Interfaces
{
    public interface INotificationService
    {
        Task SendEmailNotificationAsync(BaseEmailNotificationDto notificationDto, CancellationToken cancellationToken = default);
    } 
}
