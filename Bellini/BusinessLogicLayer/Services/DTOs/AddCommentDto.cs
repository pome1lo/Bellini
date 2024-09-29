namespace BusinessLogicLayer.Services.DTOs
{
    public class AddCommentDto
    {
        public int UserId { get; set; }
        public string CommentText { get; set; } = null!;
        public DateTime CommentDate { get; set; }
    }
}
