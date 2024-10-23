using DataAccess.Data;
using DataAccess.Data.Interfaces;
using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Data.Repositories
{
    public class QuizAnswerOptionRepository : IRepository<QuizAnswerOption>
    {
        private readonly AppDbContext _context;
        private readonly DbSet<QuizAnswerOption> _dbSet;

        public QuizAnswerOptionRepository(AppDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<QuizAnswerOption>();
        }

        public async Task<IEnumerable<QuizAnswerOption>> GetElementsAsync(CancellationToken cancellationToken = default)
        {
            return await _dbSet.ToListAsync(cancellationToken);
        }

        public async Task<QuizAnswerOption> GetItemAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _dbSet.FindAsync(new object[] { id }, cancellationToken);
        }

        public async Task CreateAsync(QuizAnswerOption item, CancellationToken cancellationToken = default)
        {
            await _dbSet.AddAsync(item, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdateAsync(int id, QuizAnswerOption item, CancellationToken cancellationToken = default)
        {
            var existingItem = await _dbSet.FindAsync(new object[] { id }, cancellationToken);
            if (existingItem != null)
            {
                _context.Entry(existingItem).CurrentValues.SetValues(item);
                await _context.SaveChangesAsync(cancellationToken);
            }
        }

        public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            var item = await _dbSet.FindAsync(new object[] { id }, cancellationToken);
            if (item != null)
            {
                _dbSet.Remove(item);
                await _context.SaveChangesAsync(cancellationToken);
            }
        }
    }
}
