namespace DataAccessLayer.Services.DTOs
{
    public class JoinGameDto
    {
        public string GameId { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string ProfileImageUrl { get; set; } = null!;
    }
}
