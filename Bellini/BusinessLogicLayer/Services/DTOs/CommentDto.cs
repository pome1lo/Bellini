namespace DataAccessLayer.Services.DTOs
{
    public class CommentDto
    {
        public int Id { get; set; }
        public int GameId { get; set; }
        public string Content { get; set; } = null!;
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
