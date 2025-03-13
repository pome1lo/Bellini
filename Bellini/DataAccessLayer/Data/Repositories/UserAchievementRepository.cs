using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;
using UtilsModelsLibrary.Enums;

namespace DataAccessLayer.Data.Repositories
{
    public class UserAchievementRepository : IRepository<UserAchievement>
    {
        private readonly AppDbContext _context;

        public UserAchievementRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UserAchievement>> GetElementsAsync(CancellationToken cancellationToken = default)
        {
            return await _context.UserAchievements
                .Include(g => g.User)
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

        public async Task<UserAchievement> GetItemAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _context.UserAchievements.FindAsync(new object[] { id }, cancellationToken);
        }

        public async Task<IEnumerable<UserAchievement>> GetUserAchievementsAsync(int userId, CancellationToken cancellationToken = default)
        {
            return await _context.UserAchievements
                .Include(g => g.User)
                .Where(ua => ua.UserId == userId)
                .ToListAsync(cancellationToken);
        }

        public async Task<bool> HasAchievementAsync(int userId, AchievementType achievement, CancellationToken cancellationToken = default)
        {
            return await _context.UserAchievements
                .AnyAsync(ua => ua.UserId == userId && ua.Achievement == achievement, cancellationToken);
        }

        public async Task CreateAsync(UserAchievement item, CancellationToken cancellationToken = default)
        {
            await _context.UserAchievements.AddAsync(item, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdateAsync(int id, UserAchievement item, CancellationToken cancellationToken = default)
        {
            _context.UserAchievements.Update(item);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            var achievement = await _context.UserAchievements.FindAsync(id);
            if (achievement is not null)
            {
                _context.UserAchievements.Remove(achievement);
                await _context.SaveChangesAsync(cancellationToken);
            }
        }
    }
}
