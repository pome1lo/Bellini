using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Data.Repositories
{
    public class QuestionRepository : BaseRepository<Question>
    {
        public QuestionRepository(DbContext context) : base(context) { }

        public override async Task<IEnumerable<Question>> GetElementsAsync(CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .AsNoTracking()
                .Include(q => q.AnswerOptions)
                .ToListAsync(cancellationToken);
        }

        public override async Task<Question> GetItemAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .Include(q => q.AnswerOptions)
                .FirstOrDefaultAsync(q => q.Id == id, cancellationToken);
        }
    }
}
