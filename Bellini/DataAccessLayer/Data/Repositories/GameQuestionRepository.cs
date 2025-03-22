using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Data.Repositories
{
    public class GameQuestionRepository : IRepository<GameQuestion>
    {
        private readonly AppDbContext _context;

        public GameQuestionRepository(AppDbContext dbContext)
        {
            _context = dbContext;
        }

        public async Task<IEnumerable<GameQuestion>> GetElementsAsync(CancellationToken cancellationToken = default)
        {
            return await _context.Questions
                                 .AsNoTracking()
                                 .Include(q => q.AnswerOptions)
                                 .ToListAsync(cancellationToken);
        }
        public async Task<GameQuestion> GetItemAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _context.Questions
                                 .Include(q => q.AnswerOptions)
                                 .FirstOrDefaultAsync(q => q.Id == id, cancellationToken);
        }
        public async Task CreateAsync(GameQuestion item, CancellationToken cancellationToken = default)
        {
            await _context.Questions.AddAsync(item, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }
        public async Task UpdateAsync(int id, GameQuestion item, CancellationToken cancellationToken = default)
        {
            var questionToUpdate = await _context.Questions.FindAsync(id);
            if (questionToUpdate is not null)
            {
                questionToUpdate.Text = item.Text;
                questionToUpdate.IsCustom = item.IsCustom;
                questionToUpdate.GameId = item.GameId;
                await _context.SaveChangesAsync(cancellationToken);
            }
        }
        public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            var questionToDelete = await _context.Questions.FindAsync(id);
            if (questionToDelete is not null)
            {
                _context.Questions.Remove(questionToDelete);
                await _context.SaveChangesAsync(cancellationToken);
            }
        }
    }
}