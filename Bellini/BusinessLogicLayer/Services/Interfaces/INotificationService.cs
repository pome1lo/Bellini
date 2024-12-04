using DataAccessLayer.Services.DTOs;

namespace DataAccessLayer.Services.Interfaces
{
    public interface INotificationService
    {
        Task<(IEnumerable<NotificationDto> Notifications, int TotalCount)> GetAllNotificationsForUserAsync(int userId, int limit, int offset, CancellationToken cancellationToken = default);
        Task CreateNotificationForUserAsync(CreateNotificationDto notificationDto, CancellationToken cancellationToken = default);
        Task SendEmailNotificationAsync(BaseEmailNotificationDto notificationDto, CancellationToken cancellationToken = default);
    }
}
