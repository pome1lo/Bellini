using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Data.Repositories
{
    public class NotificationRepository : IRepository<Notification>
    {
        private readonly AppDbContext _context;

        public NotificationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Notification>> GetElementsAsync(CancellationToken cancellationToken = default)
        {
            return await _context.Set<Notification>().ToListAsync(cancellationToken);
        }

        public async Task<Notification> GetItemAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _context.Set<Notification>().FirstOrDefaultAsync(n => n.Id == id, cancellationToken)
                   ?? throw new KeyNotFoundException($"Notification with ID {id} not found.");
        }

        public async Task CreateAsync(Notification notification, CancellationToken cancellationToken = default)
        {
            await _context.Set<Notification>().AddAsync(notification, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdateAsync(int id, Notification updatedNotification, CancellationToken cancellationToken = default)
        {
            var notification = await GetItemAsync(id, cancellationToken);
            notification.Title = updatedNotification.Title;
            notification.Message = updatedNotification.Message;
            notification.IsRead = updatedNotification.IsRead;
            notification.CreatedAt = updatedNotification.CreatedAt;

            _context.Set<Notification>().Update(notification);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            var notification = await GetItemAsync(id, cancellationToken);
            _context.Set<Notification>().Remove(notification);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task<IEnumerable<Notification>> GetUnreadNotificationsAsync(int userId, CancellationToken cancellationToken = default)
        {
            return await _context.Set<Notification>()
                .Where(n => n.UserId == userId && !n.IsRead)
                .ToListAsync(cancellationToken);
        }
    }
}
