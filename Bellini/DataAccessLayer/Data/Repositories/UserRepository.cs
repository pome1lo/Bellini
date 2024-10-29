using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Data.Repositories
{
    public class UserRepository : IRepository<User>
    {
        private AppDbContext _context { get; set; }

        public UserRepository(AppDbContext dbContext)
        {
            _context = dbContext;
        }
        public async Task<IEnumerable<User>> GetElementsAsync(CancellationToken cancellationToken = default)
        {
            var users = await _context.Users.AsNoTracking().ToListAsync(cancellationToken);
            return users;
        }
        public async Task<User> GetItemAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _context.Users.FindAsync(id, cancellationToken);
        }
        public async Task CreateAsync(User item, CancellationToken cancellationToken = default)
        {
            await _context.Users.AddAsync(item, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }
        public async Task UpdateAsync(int id, User item, CancellationToken cancellationToken = default)
        {
            await _context.Users.Where(e => e.Id == id)
                .ExecuteUpdateAsync(s =>
                    s
                        .SetProperty(e => e.Email, item.Email)
                        .SetProperty(e => e.Password, item.Password)
                        .SetProperty(e => e.Username, item.Username)
                        .SetProperty(e => e.RegistrationCode, item.RegistrationCode)
                        .SetProperty(e => e.VerificationCode, item.VerificationCode)
                        .SetProperty(e => e.VerificationCodeExpiry, item.VerificationCodeExpiry),
                    cancellationToken
                );
            await _context.SaveChangesAsync(cancellationToken);
        }
        public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            await _context.Users.Where(e => e.Id == id).ExecuteDeleteAsync(cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}