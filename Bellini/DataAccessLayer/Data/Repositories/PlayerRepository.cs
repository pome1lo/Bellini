using DataAccess.Data;
using DataAccess.Data.Interfaces;
using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Data.Repositories
{
    public class PlayerRepository : IRepository<Player>
    {
        private readonly AppDbContext _context;

        public PlayerRepository(AppDbContext dbContext)
        {
            _context = dbContext;
        }
        public async Task<IEnumerable<Player>> GetElementsAsync(CancellationToken cancellationToken = default)
        {
            return await _context.Players
                .AsNoTracking()
                .Include(p => p.User)
                .Include(p => p.Game)
                .ToListAsync(cancellationToken);
        }

        public async Task<Player> GetItemAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _context.Players
                .Include(p => p.User)
                .Include(p => p.Game)
                .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
        }
        public async Task CreateAsync(Player item, CancellationToken cancellationToken = default)
        {
            await _context.Players.AddAsync(item, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }
        public async Task UpdateAsync(int id, Player item, CancellationToken cancellationToken = default)
        {
            await _context.Players.Where(e => e.Id == id)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(e => e.Name, item.Name)
                    .SetProperty(e => e.GameId, item.GameId)
                    .SetProperty(e => e.UserId, item.UserId),
                    cancellationToken
                );
            await _context.SaveChangesAsync(cancellationToken);
        }
        public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            await _context.Players.Where(e => e.Id == id).ExecuteDeleteAsync(cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}