using DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Data.Repositories
{
    public class GameRepository : BaseRepository<Game>
    {
        public GameRepository(DbContext context) : base(context) { }

        public override async Task<IEnumerable<Game>> GetElementsAsync(CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .AsNoTracking()
                .Include(g => g.Status)
                .Include(g => g.Players)
                .Include(g => g.Comments)
                .Include(g => g.Questions)
                .ToListAsync(cancellationToken);
        }

        public override async Task<Game> GetItemAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .Include(g => g.Status)
                .Include(g => g.Players)
                .Include(g => g.Comments)
                .Include(g => g.Questions)
                    .ThenInclude(q => q.AnswerOptions)
                .FirstOrDefaultAsync(g => g.Id == id, cancellationToken);
        }
    }
}
