using DataAccessLayer.Data;
using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Data.Repositories
{
    public class QuizQuestionRepository : IRepository<QuizQuestion>
    {
        private readonly AppDbContext _context;
        private readonly DbSet<QuizQuestion> _dbSet;

        public QuizQuestionRepository(AppDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<QuizQuestion>();
        }

        public async Task<IEnumerable<QuizQuestion>> GetElementsAsync(CancellationToken cancellationToken = default)
        {
            // Включение связанных сущностей, таких как Quiz и AnswerOptions
            return await _dbSet
                .Include(q => q.Quiz) // Включение информации о квизе
                .Include(q => q.AnswerOptions) // Включение вариантов ответов
                .ToListAsync(cancellationToken);
        }

        public async Task<QuizQuestion> GetItemAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .Include(q => q.Quiz)
                .Include(q => q.AnswerOptions)
                .FirstOrDefaultAsync(q => q.Id == id, cancellationToken);
        }

        public async Task CreateAsync(QuizQuestion item, CancellationToken cancellationToken = default)
        {
            await _dbSet.AddAsync(item, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdateAsync(int id, QuizQuestion item, CancellationToken cancellationToken = default)
        {
            var existingItem = await _dbSet.FindAsync(new object[] { id }, cancellationToken);
            if (existingItem != null)
            {
                _context.Entry(existingItem).CurrentValues.SetValues(item);
                // Обновление связанных сущностей, если необходимо (например, вариантов ответов)
                if (item.AnswerOptions != null)
                {
                    _context.Entry(existingItem).Collection(e => e.AnswerOptions).IsModified = true;
                }
                await _context.SaveChangesAsync(cancellationToken);
            }
        }

        public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            var item = await _dbSet.FindAsync(new object[] { id }, cancellationToken);
            if (item != null)
            {
                _dbSet.Remove(item);
                await _context.SaveChangesAsync(cancellationToken);
            }
        }
    }
}
