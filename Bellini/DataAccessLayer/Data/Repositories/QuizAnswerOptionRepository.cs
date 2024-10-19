using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Data.Repositories
{
    public class QuizAnswerOptionRepository : BaseRepository<QuizAnswerOption>
    {
        public QuizAnswerOptionRepository(DbContext context) : base(context) { }
    }
}
