using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Data.Repositories
{
    public class QuizCommentRepository : IRepository<QuizComment>
    {
        private readonly AppDbContext _context;

        public QuizCommentRepository(AppDbContext dbContext)
        {
            _context = dbContext;
        }

        public async Task<IEnumerable<QuizComment>> GetElementsAsync(CancellationToken cancellationToken = default)
        {
            return await _context.QuizComments.AsNoTracking().ToListAsync(cancellationToken);
        }

        public async Task<QuizComment> GetItemAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _context.QuizComments.FindAsync(new object[] { id }, cancellationToken);
        }

        public async Task CreateAsync(QuizComment item, CancellationToken cancellationToken = default)
        {
            item.CommentDate = DateTime.UtcNow;
            await _context.QuizComments.AddAsync(item, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdateAsync(int id, QuizComment item, CancellationToken cancellationToken = default)
        {
            await _context.QuizComments.Where(e => e.Id == id)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(e => e.Content, item.Content)
                    .SetProperty(e => e.QuizId, item.QuizId)
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
            await _context.QuizComments.Where(e => e.Id == id).ExecuteDeleteAsync(cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
