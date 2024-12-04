using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Data.Repositories
{
    public class QuizRepository : IRepository<Quiz>
    {
        private readonly AppDbContext _context;
        private readonly DbSet<Quiz> _dbSet;

        public QuizRepository(AppDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<Quiz>();
        }

        // Получение всех квизов с включением связанных вопросов и результатов
        public async Task<IEnumerable<Quiz>> GetElementsAsync(CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .Include(q => q.Questions) // Включение связанных вопросов
                .Include(q => q.QuizResults) // Включение результатов квиза
                .Include(g => g.Comments)
                .ToListAsync(cancellationToken);
        }

        // Получение конкретного квиза по ID с включением связанных данных
        public async Task<Quiz> GetItemAsync(int id, CancellationToken cancellationToken = default)
        {
            var obj = await _dbSet
                .Include(q => q.Questions) // Включение связанных вопросов
                    .ThenInclude(q => q.AnswerOptions)
                .Include(q => q.QuizResults) // Включение результатов квиза
                .Include(g => g.Comments)
                .AsSplitQuery()
                .FirstOrDefaultAsync(q => q.Id == id, cancellationToken);

            return obj;
        }

        // Создание нового квиза
        public async Task CreateAsync(Quiz item, CancellationToken cancellationToken = default)
        {
            await _dbSet.AddAsync(item, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        // Обновление существующего квиза по ID
        public async Task UpdateAsync(int id, Quiz item, CancellationToken cancellationToken = default)
        {
            var existingItem = await _dbSet.FindAsync(new object[] { id }, cancellationToken);
            if (existingItem is not null)
            {
                _context.Entry(existingItem).CurrentValues.SetValues(item);
                // Обновление связанных сущностей (вопросов и результатов), если необходимо
                if (item.Questions is not null)
                {
                    _context.Entry(existingItem).Collection(e => e.Questions).IsModified = true;
                }
                if (item.QuizResults is not null)
                {
                    _context.Entry(existingItem).Collection(e => e.QuizResults).IsModified = true;
                }
                await _context.SaveChangesAsync(cancellationToken);
            }
        }

        // Удаление квиза по ID
        public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            var item = await _dbSet.FindAsync(new object[] { id }, cancellationToken);
            if (item is not null)
            {
                _dbSet.Remove(item);
                await _context.SaveChangesAsync(cancellationToken);
            }
        }
    }
}
