using System.Text.Json.Serialization;

namespace DataAccessLayer.Models
{
    public class GameStatus : BaseModel
    {
        public string Name { get; set; } = null!;
        [JsonIgnore] public List<Game> Games { get; set; } = null!;
    }
}
