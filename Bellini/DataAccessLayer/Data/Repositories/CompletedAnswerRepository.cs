using BusinessLogicLayer.Exceptions;
using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Models;

using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Data.Repositories
{
    public class CompletedAnswerRepository : IRepository<CompletedAnswer>
    {
        private readonly AppDbContext _context;
        private readonly DbSet<CompletedAnswer> _dbSet;

        public CompletedAnswerRepository(AppDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<CompletedAnswer>();
        }

        public async Task<IEnumerable<CompletedAnswer>> GetElementsAsync(CancellationToken cancellationToken = default)
        {
            return await _dbSet.AsNoTracking().ToListAsync(cancellationToken);
        }

        public async Task<CompletedAnswer> GetItemAsync(int id, CancellationToken cancellationToken = default)
        {
            var item = await _dbSet.FindAsync(new object[] { id }, cancellationToken);
            if (item == null)
            {
                throw new NotFoundException($"CompletedAnswer with ID {id} not found.");
            }
            return item;
        }

        public async Task CreateAsync(CompletedAnswer item, CancellationToken cancellationToken = default)
        {
            await _dbSet.AddAsync(item, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdateAsync(int id, CompletedAnswer item, CancellationToken cancellationToken = default)
        {
            var existingItem = await GetItemAsync(id, cancellationToken);
            if (existingItem == null)
            {
                throw new NotFoundException($"CompletedAnswer with ID {id} not found.");
            }

            _context.Entry(existingItem).CurrentValues.SetValues(item);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            var item = await GetItemAsync(id, cancellationToken);
            if (item == null)
            {
                throw new NotFoundException($"CompletedAnswer with ID {id} not found.");
            }

            _dbSet.Remove(item);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
