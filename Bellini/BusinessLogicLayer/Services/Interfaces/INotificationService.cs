using BusinessLogicLayer.Services.DTOs;

namespace BusinessLogicLayer.Services.Interfaces
{
    public interface INotificationService
    {
        /// <summary>
        /// Получает список уведомлений для пользователя с пагинацией.
        /// </summary>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <param name="limit">Количество уведомлений на странице.</param>
        /// <param name="offset">Смещение для пагинации.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Список уведомлений пользователя и их общее количество.</returns>
        Task<(IEnumerable<NotificationDto> Notifications, int TotalCount)> GetAllNotificationsForUserAsync(int userId, int limit, int offset, CancellationToken cancellationToken = default);

        /// <summary>
        /// Создает уведомление для пользователя.
        /// </summary>
        /// <param name="notificationDto">Данные для создания уведомления.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        Task CreateNotificationForUserAsync(CreateNotificationDto notificationDto, CancellationToken cancellationToken = default);

        /// <summary>
        /// Отправляет email-уведомление пользователю.
        /// </summary>
        /// <param name="notificationDto">Данные для email-уведомления.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        Task SendEmailNotificationAsync(BaseEmailNotificationDto notificationDto, CancellationToken cancellationToken = default);

        /// <summary>
        /// Отправляет invite-уведомление пользователю.
        /// </summary>
        /// <param name="notificationDto">Данные для email-уведомления.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        Task CreateInviteNotificationForUserAsync(CreateInviteNotificationDto notificationDto, CancellationToken cancellationToken = default);
    }
}
