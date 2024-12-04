using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Data.Repositories
{
    public class GameCommentRepository : IRepository<GameComment>
    {
        private readonly AppDbContext _context;

        public GameCommentRepository(AppDbContext dbContext)
        {
            _context = dbContext;
        }

        public async Task<IEnumerable<GameComment>> GetElementsAsync(CancellationToken cancellationToken = default)
        {
            return await _context.GameComments.AsNoTracking().ToListAsync(cancellationToken);
        }

        public async Task<GameComment> GetItemAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _context.GameComments.FindAsync(new object[] { id }, cancellationToken);
        }

        public async Task CreateAsync(GameComment item, CancellationToken cancellationToken = default)
        {
            item.CommentDate = DateTime.UtcNow;
            await _context.GameComments.AddAsync(item, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdateAsync(int id, GameComment item, CancellationToken cancellationToken = default)
        {
            await _context.GameComments.Where(e => e.Id == id)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(e => e.Content, item.Content)
                    .SetProperty(e => e.GameId, item.GameId)
                    .SetProperty(e => e.UserId, item.UserId)
                    .SetProperty(e => e.Username, item.Username)
                    .SetProperty(e => e.ProfileImageUrl, item.ProfileImageUrl)
                    .SetProperty(e => e.CommentDate, DateTime.UtcNow),
                    cancellationToken
                );
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            await _context.GameComments.Where(e => e.Id == id).ExecuteDeleteAsync(cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
