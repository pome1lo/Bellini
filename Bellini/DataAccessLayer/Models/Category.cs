using DataAccess.Models;

namespace DataAccessLayer.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<Game> Games { get; set; } = null!;
    }
}
