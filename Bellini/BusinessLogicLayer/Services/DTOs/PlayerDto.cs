namespace BusinessLogicLayer.Services.DTOs
{
    public class PlayerDto
    {

        //todo add VALIDATOR

        public int Id { get; set; }
        public int GameId { get; set; }
        public string UserId { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string ProfileImageUrl { get; set; } = null!;
    }
}
