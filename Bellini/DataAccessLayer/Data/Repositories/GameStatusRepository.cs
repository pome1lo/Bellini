using DataAccess.Data;
using DataAccess.Data.Interfaces;
using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Data.Repositories
{
    public class GameStatusRepository : IRepository<GameStatus>
    {
        private readonly AppDbContext _context;
        public GameStatusRepository(AppDbContext dbContext)
        {
            _context = dbContext;
        }
        public async Task<IEnumerable<GameStatus>> GetElementsAsync(CancellationToken cancellationToken = default)
        {
            return await _context.GameStatuses.AsNoTracking().ToListAsync(cancellationToken);
        }
        public async Task<GameStatus> GetItemAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _context.GameStatuses.FindAsync(new object[] { id }, cancellationToken);
        }
        public async Task CreateAsync(GameStatus item, CancellationToken cancellationToken = default)
        {
            await _context.GameStatuses.AddAsync(item, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }
        public async Task UpdateAsync(int id, GameStatus item, CancellationToken cancellationToken = default)
        {
            await _context.GameStatuses.Where(e => e.Id == id)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(e => e.Name, item.Name),
                    cancellationToken
                );
            await _context.SaveChangesAsync(cancellationToken);
        }
        public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            await _context.GameStatuses.Where(e => e.Id == id).ExecuteDeleteAsync(cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}