using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Data.Repositories
{
    public class QuizQuestionRepository : BaseRepository<QuizQuestion>
    {
        public QuizQuestionRepository(DbContext context) : base(context) { }
    }
}
