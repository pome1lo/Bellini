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

        // Получение всех игр
        public async Task<IEnumerable<Game>> GetElementsAsync(CancellationToken cancellationToken = default)
        {
            return await _context.Games
                                 .AsNoTracking()
                                 .Include(g => g.Status) // Включаем статус игры
                                 .Include(g => g.Players) // Включаем игроков
                                 .Include(g => g.Comments) // Включаем комментарии
                                 .ToListAsync(cancellationToken);
        }

        // Получение конкретной игры по Id
        public async Task<Game> GetItemAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _context.Games
                                 .Include(g => g.Status) // Включаем статус игры
                                 .Include(g => g.Players) // Включаем игроков
                                 .Include(g => g.Comments) // Включаем комментарии
                                 .FirstOrDefaultAsync(g => g.Id == id, cancellationToken);
        }

        // Создание новой игры
        public async Task CreateAsync(Game item, CancellationToken cancellationToken = default)
        {
            await _context.Games.AddAsync(item, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        // Обновление существующей игры
        public async Task UpdateAsync(int id, Game item, CancellationToken cancellationToken = default)
        {
            // Найдем игру по id
            var gameToUpdate = await _context.Games.FindAsync(id);
            if (gameToUpdate != null)
            {
                // Обновляем поля игры
                gameToUpdate.GameName = item.GameName;
                gameToUpdate.HostId = item.HostId;
                gameToUpdate.StartTime = item.StartTime;
                gameToUpdate.MaxPlayers = item.MaxPlayers;
                gameToUpdate.IsPrivate = item.IsPrivate; // Учитываем приватность игры
                gameToUpdate.RoomPassword = item.RoomPassword; // Учитываем пароль комнаты
                gameToUpdate.GameCoverImageUrl = item.GameCoverImageUrl;
                gameToUpdate.Status = item.Status; // Обновляем статус игры

                await _context.SaveChangesAsync(cancellationToken);
            }
        }

        // Удаление игры
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
