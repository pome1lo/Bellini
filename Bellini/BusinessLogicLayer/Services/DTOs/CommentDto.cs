namespace BusinessLogicLayer.Services.DTOs
{
    public class CommentDto
    {
        public int CommentId { get; set; }
        public int UserId { get; set; }
        public string CommentText { get; set; } = null!;
        public DateTime CommentDate { get; set; }
    }
}
