using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Models;
using EmailSenderLibrary;
using DataAccessLayer.Services.DTOs;
using DataAccessLayer.Services.Interfaces;
using DataAccessLayer.Utils;
using UtilsModelsLibrary.Exceptions;

namespace DataAccessLayer.Services
{
    public class NotificationService : INotificationService
    {
        private readonly EmailSender _emailSender;
        private readonly EmailSettingsDto _emailSettingsDto;
        private readonly IRepository<Notification> _notificationRepository;
        private readonly IRepository<User> _userRepository;

        public NotificationService(IRepository<Notification> notificationRepository, IRepository<User> userRepository)
        {
            _emailSettingsDto = ConfigurationHelper.GetEmailSettings();

            _emailSender = new EmailSender(
               _emailSettingsDto.SmtpServer,
               _emailSettingsDto.SmtpPort,
               _emailSettingsDto.Email,
               _emailSettingsDto.Password
            );

            _notificationRepository = notificationRepository;
            _userRepository = userRepository;
        }

        public async Task CreateNotificationForUserAsync(CreateNotificationDto notificationDto, CancellationToken cancellationToken = default)
        {
            var user = await _userRepository.GetItemAsync(notificationDto.UserId, cancellationToken);
            if (user is null)
            {
                throw new NotFoundException("User not found.");
            }

            var notification = new Notification
            {
                UserId = notificationDto.UserId,
                Title = notificationDto.Title,
                Message = notificationDto.Message,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            await _notificationRepository.CreateAsync(notification, cancellationToken);
        }

        public async Task<(IEnumerable<NotificationDto> Notifications, int TotalCount)> GetAllNotificationsForUserAsync(int userId, int limit, int offset, CancellationToken cancellationToken = default)
        {
            var user = await _userRepository.GetItemAsync(userId, cancellationToken);
            if (user is null)
            {
                throw new NotFoundException("User not found.");
            }

            var allNotifications = (await _notificationRepository.GetElementsAsync(cancellationToken))
                .Where(n => n.UserId == userId);

            var totalCount = allNotifications.Count();

            var paginatedNotifications = allNotifications
                .Skip(offset)
                .Take(limit)
                .Select(n => new NotificationDto
                {
                    Id = n.Id,
                    Title = n.Title,
                    Message = n.Message,
                    CreatedAt = n.CreatedAt,
                    IsRead = n.IsRead
                })
                .ToList();

            return (paginatedNotifications, totalCount);
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
