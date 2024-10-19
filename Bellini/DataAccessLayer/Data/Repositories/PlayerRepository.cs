using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Data.Repositories
{
    public class PlayerRepository : BaseRepository<Player>
    {
        public PlayerRepository(DbContext context) : base(context) { }

        public override async Task<IEnumerable<Player>> GetElementsAsync(CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .AsNoTracking()
                .Include(p => p.User)
                .Include(p => p.Game)
                .ToListAsync(cancellationToken);
        }

        public override async Task<Player> GetItemAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .Include(p => p.User)
                .Include(p => p.Game)
                .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
        }
    }
}
