using DataAccess.Models;

namespace DataAccessLayer.Models
{
    public class GameStatus : BaseModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public List<Game> Games { get; set; } = null!;
    }
}
