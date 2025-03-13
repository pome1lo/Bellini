using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.Data.Repositories
{
    public class UserStatisticsRepository : IRepository<UserStatistics>
    {
        private readonly AppDbContext _context;

        public UserStatisticsRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UserStatistics>> GetElementsAsync(CancellationToken cancellationToken = default)
        {
            return await _context.UserStatistics
                .Include(g => g.User)
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

        public async Task<UserStatistics> GetItemAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _context.UserStatistics.FindAsync(new object[] { id }, cancellationToken);
        }

        public async Task<UserStatistics> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default)
        {
            return await _context.UserStatistics
                .Include(g => g.User)
                .FirstOrDefaultAsync(us => us.UserId == userId, cancellationToken);
        }

        public async Task CreateAsync(UserStatistics item, CancellationToken cancellationToken = default)
        {
            await _context.UserStatistics.AddAsync(item, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdateAsync(int id, UserStatistics item, CancellationToken cancellationToken = default)
        {
            _context.UserStatistics.Update(item);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            var statistics = await _context.UserStatistics.FindAsync(id);
            if (statistics is not null)
            {
                _context.UserStatistics.Remove(statistics);
                await _context.SaveChangesAsync(cancellationToken);
            }
        }
    }
}
