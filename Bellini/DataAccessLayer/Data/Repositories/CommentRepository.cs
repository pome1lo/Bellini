using DataAccess.Data;
using DataAccess.Data.Interfaces;
using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Data.Repositories
{
    public class CommentRepository : IRepository<Comment>
    {
        private readonly AppDbContext _context;

        public CommentRepository(AppDbContext dbContext)
        {
            _context = dbContext;
        }

        public async Task<IEnumerable<Comment>> GetElementsAsync(CancellationToken cancellationToken = default)
        {
            return await _context.Comments.AsNoTracking().ToListAsync(cancellationToken);
        }
        public async Task<Comment> GetItemAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _context.Comments.FindAsync(new object[] { id }, cancellationToken);
        }
        public async Task CreateAsync(Comment item, CancellationToken cancellationToken = default)
        {
            await _context.Comments.AddAsync(item, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }
        public async Task UpdateAsync(int id, Comment item, CancellationToken cancellationToken = default)
        {
            await _context.Comments.Where(e => e.Id == id)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(e => e.Content, item.Content)
                    .SetProperty(e => e.GameId, item.GameId),
                    cancellationToken
                );
            await _context.SaveChangesAsync(cancellationToken);
        }
        public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            await _context.Comments.Where(e => e.Id == id).ExecuteDeleteAsync(cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}