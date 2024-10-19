using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Data.Repositories
{
    public class QuizRepository : BaseRepository<Quiz>
    {
        public QuizRepository(DbContext context) : base(context) { }
    }
}
