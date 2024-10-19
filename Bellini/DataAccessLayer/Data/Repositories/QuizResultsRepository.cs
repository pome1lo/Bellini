using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Data.Repositories
{
    public class QuizResultsRepository : BaseRepository<QuizResults>
    {
        public QuizResultsRepository(DbContext context) : base(context) { }
    }
}
