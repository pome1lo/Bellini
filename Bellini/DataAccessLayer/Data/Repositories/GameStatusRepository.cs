using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Data.Repositories
{
    public class GameStatusRepository : BaseRepository<GameStatus>
    {
        public GameStatusRepository(DbContext context) : base(context) { }
    }
}
