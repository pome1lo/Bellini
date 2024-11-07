namespace BusinessLogicLayer.Services.DTOs
{
    public class CreateCommentDto
    {
        public int GameId { get; set; }
        public int UserId { get; set; }
        public string Content { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string ProfileImageUrl { get; set; } = null!;
        public DateTime CommentDate { get; set; }
    }
}
