using DataAccess.Models;
using DataAccessLayer.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Data.Repositories
{
    public class UserRepository : BaseRepository<User>
    {
        public UserRepository(DbContext dbContext) : base(dbContext) { }

        public override async Task UpdateAsync(int id, User item, CancellationToken cancellationToken = default)
        {
            await _dbSet.Where(e => e.Id == id)
                .ExecuteUpdateAsync(s => s
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
    }
}
