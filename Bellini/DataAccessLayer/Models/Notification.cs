using System.Text.Json.Serialization;

namespace DataAccessLayer.Models
{
    public class Notification : BaseModel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        [JsonIgnore] public User User { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string Message { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsRead { get; set; } = false;
    }
}
