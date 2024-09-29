namespace BusinessLogicLayer.Services.DTOs
{
    public class PlayerDto
    {
        public int PlayerId { get; set; }
        public string PlayerName { get; set; } = null!;
        public int Score { get; set; }
    }
}
