using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Data.Repositories
{
    public class BaseRepository<T> : IRepository<T> where T : BaseModel
    {
        protected readonly DbContext _context;
        protected readonly DbSet<T> _dbSet;

        public BaseRepository(DbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public virtual async Task<IEnumerable<T>> GetElementsAsync(CancellationToken cancellationToken = default)
        {
            return await _dbSet.ToListAsync(cancellationToken);
        }

        public virtual async Task<T> GetItemAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _dbSet.FindAsync(new object[] { id }, cancellationToken);
        }

        public virtual async Task CreateAsync(T item, CancellationToken cancellationToken = default)
        {
            await _dbSet.AddAsync(item, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public virtual async Task UpdateAsync(int id, T item, CancellationToken cancellationToken = default)
        {
            var existingItem = await _dbSet.FindAsync(new object[] { id }, cancellationToken);
            if (existingItem is not null)
            {
                _context.Entry(existingItem).CurrentValues.SetValues(item);
                await _context.SaveChangesAsync(cancellationToken);
            }
        }

        public virtual async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            var item = await _dbSet.FindAsync(new object[] { id }, cancellationToken);
            if (item is not null)
            {
                _dbSet.Remove(item);
                await _context.SaveChangesAsync(cancellationToken);
            }
        }
    }
}
