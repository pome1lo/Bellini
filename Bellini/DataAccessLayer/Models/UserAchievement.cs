using System.Text.Json.Serialization;
using UtilsModelsLibrary.Enums;

namespace DataAccessLayer.Models
{
    public class UserAchievement : BaseModel
    {
        public int UserId { get; set; }
        [JsonIgnore] public User User { get; set; } = null!;
        public AchievementType Achievement { get; set; }
        public DateTime AchievedAt { get; set; }
    }
}
