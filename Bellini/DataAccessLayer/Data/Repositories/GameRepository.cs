using DataAccess.Data;
using DataAccess.Data.Interfaces;
using DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Data.Repositories
{
    public class GameRepository : IRepository<Game>
    {
        private readonly AppDbContext _context;

        public GameRepository(AppDbContext dbContext)
        {
            _context = dbContext;
        }

        public async Task<IEnumerable<Game>> GetElementsAsync(CancellationToken cancellationToken = default)
        {
            return await _context.Games.AsNoTracking().ToListAsync(cancellationToken);
        }

        public async Task<Game> GetItemAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _context.Games.FindAsync(new object[] { id }, cancellationToken);
        }

        public async Task CreateAsync(Game item, CancellationToken cancellationToken = default)
        {
            await _context.Games.AddAsync(item, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdateAsync(int id, Game item, CancellationToken cancellationToken = default)
        {
            await _context.Games.Where(e => e.Id == id)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(e => e.GameName, item.GameName)
                    .SetProperty(e => e.HostId, item.HostId)
                    .SetProperty(e => e.StartTime, item.StartTime)
                    .SetProperty(e => e.MaxPlayers, item.MaxPlayers)
                    .SetProperty(e => e.IsActive, item.IsActive)
                    .SetProperty(e => e.DifficultyLevel, item.DifficultyLevel),
                    cancellationToken
                );
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            await _context.Games.Where(e => e.Id == id).ExecuteDeleteAsync(cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
