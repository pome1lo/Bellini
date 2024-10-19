using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Data.Repositories
{
    public class CommentRepository : BaseRepository<Comment>
    {
        public CommentRepository(DbContext context) : base(context) { }

        public override async Task<IEnumerable<Comment>> GetElementsAsync(CancellationToken cancellationToken = default)
        {
            return await _dbSet.AsNoTracking().ToListAsync(cancellationToken);
        }

        public override async Task<Comment> GetItemAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _dbSet.FindAsync(new object[] { id }, cancellationToken);
        }
    }
}
