using DataAccessLayer.Data;
using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Data.Repositories
{
    public class AnswerOptionRepository : IRepository<AnswerOption>
    {
        private readonly AppDbContext _context;

        public AnswerOptionRepository(AppDbContext dbContext)
        {
            _context = dbContext;
        }

        public async Task<IEnumerable<AnswerOption>> GetElementsAsync(CancellationToken cancellationToken = default)
        {
            return await _context.AnswerOptions
                                 .AsNoTracking()
                                 .ToListAsync(cancellationToken);
        }

        public async Task<AnswerOption> GetItemAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _context.AnswerOptions
                                 .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
        }

        public async Task CreateAsync(AnswerOption item, CancellationToken cancellationToken = default)
        {
            await _context.AnswerOptions.AddAsync(item, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdateAsync(int id, AnswerOption item, CancellationToken cancellationToken = default)
        {
            var answerToUpdate = await _context.AnswerOptions.FindAsync(id);
            if (answerToUpdate != null)
            {
                answerToUpdate.Text = item.Text;
                answerToUpdate.IsCorrect = item.IsCorrect;
                answerToUpdate.QuestionId = item.QuestionId;

                await _context.SaveChangesAsync(cancellationToken);
            }
        }

        public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            var answerToDelete = await _context.AnswerOptions.FindAsync(id);
            if (answerToDelete != null)
            {
                _context.AnswerOptions.Remove(answerToDelete);
                await _context.SaveChangesAsync(cancellationToken);
            }
        }
    }
}
