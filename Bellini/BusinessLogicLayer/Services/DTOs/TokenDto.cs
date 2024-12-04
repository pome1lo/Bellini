namespace DataAccessLayer.Services.DTOs
{
    public class TokenDto
    {
        public string AccessToken { get; set; } = null!;
        public string RefreshToken { get; set; } = null!;
        public string? Username { get; set; } = null!;
        public int? UserId { get; set; } = null!;
    }
}
