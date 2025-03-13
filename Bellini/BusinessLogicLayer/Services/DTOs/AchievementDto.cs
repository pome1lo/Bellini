using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UtilsModelsLibrary.Enums;

namespace BusinessLogicLayer.Services.DTOs
{
    public class AchievementDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public AchievementType AchievementType { get; set; }
        public DateTime DateAchieved { get; set; }
        public string Description { get; set; } = string.Empty;
    }
}
