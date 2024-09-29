using DataAccess.Models;

namespace DataAccessLayer.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public int GameId { get; set; }
        public int UserId { get; set; }
        public string Content { get; set; } = null!;
        public DateTime CommentDate { get; set; }
        public Game Game { get; set; } = null!;
    }
}
