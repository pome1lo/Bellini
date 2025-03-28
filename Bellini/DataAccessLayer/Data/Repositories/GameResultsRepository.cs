﻿using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Data.Repositories
{
    public class GameResultsRepository : IRepository<GameResults>
    {
        private readonly AppDbContext _context;
        private readonly DbSet<GameResults> _dbSet;

        public GameResultsRepository(AppDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<GameResults>();
        }

        // Получение всех результатов с включением связанных сущностей (Game и User)
        public async Task<IEnumerable<GameResults>> GetElementsAsync(CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .Include(qr => qr.Game) // Включение связанных квизов
                .Include(qr => qr.User) // Включение информации о пользователе
                .ToListAsync(cancellationToken);
        }

        // Получение конкретного результата по ID с включением связанных данных
        public async Task<GameResults> GetItemAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .Include(qr => qr.Game)
                .Include(qr => qr.User)
                .FirstOrDefaultAsync(qr => qr.Id == id, cancellationToken);
        }

        // Создание нового результата квиза
        public async Task CreateAsync(GameResults item, CancellationToken cancellationToken = default)
        {
            await _dbSet.AddAsync(item, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        // Обновление существующего результата квиза
        public async Task UpdateAsync(int id, GameResults item, CancellationToken cancellationToken = default)
        {
            var existingItem = await _dbSet.FindAsync(new object[] { id }, cancellationToken);
            if (existingItem is not null)
            {
                _context.Entry(existingItem).CurrentValues.SetValues(item);
                await _context.SaveChangesAsync(cancellationToken);
            }
        }

        // Удаление результата квиза по ID
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
