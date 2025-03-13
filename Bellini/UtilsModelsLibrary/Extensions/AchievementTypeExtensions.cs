using System.ComponentModel;
using System.Reflection;
using UtilsModelsLibrary.Enums;

namespace UtilsModelsLibrary.Extensions
{
    public static class AchievementTypeExtensions
    {
        public static string GetDescription(this AchievementType achievement)
        {
            FieldInfo field = achievement.GetType().GetField(achievement.ToString());
            DescriptionAttribute attribute = field?.GetCustomAttribute<DescriptionAttribute>();

            return attribute?.Description ?? achievement.ToString();
        }
    }
}
