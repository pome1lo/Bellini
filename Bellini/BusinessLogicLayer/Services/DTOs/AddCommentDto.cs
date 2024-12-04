namespace DataAccessLayer.Services.DTOs
{
    public class AddCommentDto
    {
        public string Content { get; set; } = null!;
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
