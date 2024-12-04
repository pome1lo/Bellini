using DataAccessLayer.Models;

namespace DataAccessLayer.Services.DTOs
{
    public class StartGameDto
    {
        public int GameId { get; set; }
        public int HostId { get; set; }
        public List<Player> Players { get; set; } = null!;
    }
}
