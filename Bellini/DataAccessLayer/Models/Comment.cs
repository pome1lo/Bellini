using System.Text.Json.Serialization;

namespace DataAccessLayer.Models
{
    public class Comment : BaseModel
    {
        public int Id { get; set; }
        public int GameId { get; set; }
        public int UserId { get; set; }
        public string Content { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string ProfileImageUrl { get; set; } = null!;
        public DateTime CommentDate { get; set; } = DateTime.Now;
        [JsonIgnore] public Game Game { get; set; } = null!;
    }
}
