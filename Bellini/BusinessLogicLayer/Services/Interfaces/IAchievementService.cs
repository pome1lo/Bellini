using BusinessLogicLayer.Services.DTOs;
using UtilsModelsLibrary.Enums;

namespace BusinessLogicLayer.Services.Interfaces
{
    public interface IAchievementService
    {
        Task<AchievementDto> GetAchievementAsync(int userId, AchievementType achievementType, CancellationToken cancellationToken = default);
        Task<IEnumerable<AchievementDto>> GetUserAchievementsAsync(int userId, CancellationToken cancellationToken = default);
        Task AddAchievementAsync(int userId, AchievementType achievementType, CancellationToken cancellationToken = default);
        //Task DeleteAchievementAsync(int userId, AchievementType achievementType, CancellationToken cancellationToken = default);
    }
}
