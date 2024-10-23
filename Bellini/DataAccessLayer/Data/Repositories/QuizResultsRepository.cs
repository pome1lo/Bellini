using DataAccess.Data;
using DataAccess.Data.Interfaces;
using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Data.Repositories
{
    public class QuizResultsRepository : IRepository<QuizResults>
    {
        private readonly AppDbContext _context;
        private readonly DbSet<QuizResults> _dbSet;

        public QuizResultsRepository(AppDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<QuizResults>();
        }

        // Получение всех результатов с включением связанных сущностей (Quiz и User)
        public async Task<IEnumerable<QuizResults>> GetElementsAsync(CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .Include(qr => qr.Quiz) // Включение связанных квизов
                .Include(qr => qr.User) // Включение информации о пользователе
                .ToListAsync(cancellationToken);
        }

        // Получение конкретного результата по ID с включением связанных данных
        public async Task<QuizResults> GetItemAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .Include(qr => qr.Quiz)
                .Include(qr => qr.User)
                .FirstOrDefaultAsync(qr => qr.Id == id, cancellationToken);
        }

        // Создание нового результата квиза
        public async Task CreateAsync(QuizResults item, CancellationToken cancellationToken = default)
        {
            await _dbSet.AddAsync(item, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        // Обновление существующего результата квиза
        public async Task UpdateAsync(int id, QuizResults item, CancellationToken cancellationToken = default)
        {
            var existingItem = await _dbSet.FindAsync(new object[] { id }, cancellationToken);
            if (existingItem != null)
            {
                _context.Entry(existingItem).CurrentValues.SetValues(item);
                await _context.SaveChangesAsync(cancellationToken);
            }
        }

        // Удаление результата квиза по ID
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
