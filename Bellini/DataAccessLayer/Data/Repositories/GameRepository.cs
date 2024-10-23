using DataAccess.Data;
using DataAccess.Data.Interfaces;
using DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Data.Repositories
{
    public class GameRepository : IRepository<Game>
    {
        private readonly AppDbContext _context;

        public GameRepository(AppDbContext dbContext)
        {
            _context = dbContext;
        }

        public async Task<IEnumerable<Game>> GetElementsAsync(CancellationToken cancellationToken = default)
        {
            return await _context.Games
                                 .AsNoTracking()
                                 .Include(g => g.Status)
                                 .Include(g => g.Players)
                                 .Include(g => g.Comments)
                                 .Include(g => g.Questions)
                                 .ToListAsync(cancellationToken);
        }
        public async Task<Game> GetItemAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _context.Games
                                 .Include(g => g.Status)
                                 .Include(g => g.Players)
                                 .Include(g => g.Comments)
                                 .Include(g => g.Questions)
                                    .ThenInclude(q => q.AnswerOptions)
                                 .FirstOrDefaultAsync(g => g.Id == id, cancellationToken);
        }
        public async Task CreateAsync(Game item, CancellationToken cancellationToken = default)
        {
            await _context.Games.AddAsync(item, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }
        public async Task UpdateAsync(int id, Game item, CancellationToken cancellationToken = default)
        {
            var gameToUpdate = await _context.Games.FindAsync(id);
            if (gameToUpdate != null)
            {
                gameToUpdate.GameName = item.GameName;
                gameToUpdate.HostId = item.HostId;
                gameToUpdate.StartTime = item.StartTime;
                gameToUpdate.MaxPlayers = item.MaxPlayers;
                gameToUpdate.IsPrivate = item.IsPrivate;
                gameToUpdate.RoomPassword = item.RoomPassword;
                gameToUpdate.GameCoverImageUrl = item.GameCoverImageUrl;
                gameToUpdate.Status = item.Status;
                gameToUpdate.Questions = item.Questions;
                await _context.SaveChangesAsync(cancellationToken);
            }
        }
        public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            var gameToDelete = await _context.Games.FindAsync(id);
            if (gameToDelete != null)
            {
                _context.Games.Remove(gameToDelete);
                await _context.SaveChangesAsync(cancellationToken);
            }
        }
    }
}