using DataAccess.Data;
using DataAccess.Data.Interfaces;
using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Data.Repositories
{
    public class QuestionRepository : IRepository<Question>
    {
        private readonly AppDbContext _context;

        public QuestionRepository(AppDbContext dbContext)
        {
            _context = dbContext;
        }

        public async Task<IEnumerable<Question>> GetElementsAsync(CancellationToken cancellationToken = default)
        {
            return await _context.Questions
                                 .AsNoTracking()
                                 .Include(q => q.AnswerOptions)
                                 .ToListAsync(cancellationToken);
        }
        public async Task<Question> GetItemAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _context.Questions
                                 .Include(q => q.AnswerOptions)
                                 .FirstOrDefaultAsync(q => q.Id == id, cancellationToken);
        }
        public async Task CreateAsync(Question item, CancellationToken cancellationToken = default)
        {
            await _context.Questions.AddAsync(item, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }
        public async Task UpdateAsync(int id, Question item, CancellationToken cancellationToken = default)
        {
            var questionToUpdate = await _context.Questions.FindAsync(id);
            if (questionToUpdate != null)
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
            if (questionToDelete != null)
            {
                _context.Questions.Remove(questionToDelete);
                await _context.SaveChangesAsync(cancellationToken);
            }
        }
    }
}