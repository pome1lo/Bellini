using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Models;
using UtilsModelsLibrary.Base;
using UtilsModelsLibrary.Enums;

namespace BusinessLogicLayer.Services
{
    public class AchievementService : IAchievementService
    {
        private readonly IRepository<UserAchievement> _achievementRepository;

        public AchievementService(IRepository<UserAchievement> achievementRepository)
        {
            _achievementRepository = achievementRepository;
        }

        public async Task<AchievementDto> GetAchievementAsync(int userId, AchievementType achievementType, CancellationToken cancellationToken = default)
        {
            var listAchievements = await _achievementRepository.GetElementsAsync(cancellationToken);
            var achievement = listAchievements.FirstOrDefault(x => x.UserId == userId && x.Achievement == achievementType);

            return new AchievementDto
            {
                UserId = achievement!.UserId,
                AchievementType = achievement.Achievement,
                DateAchieved = achievement.AchievedAt,
                Description = achievement.Achievement.GetDescription() // Using GetDescription() method from enum
            };
        }

        public async Task<IEnumerable<AchievementDto>> GetUserAchievementsAsync(int userId, CancellationToken cancellationToken = default)
        {
            var listAchievements = await _achievementRepository.GetElementsAsync(cancellationToken);
            var achievements = listAchievements.Where(x => x.UserId == userId);

            return achievements.Select(a => new AchievementDto
            {
                UserId = a.UserId,
                AchievementType = a.Achievement,
                DateAchieved = a.AchievedAt,
                Description = a.Achievement.GetDescription()
            });
        }

        public async Task AddAchievementAsync(int userId, AchievementType achievementType, CancellationToken cancellationToken = default)
        {
            var achievement = new UserAchievement
            {
                UserId = userId,
                Achievement = achievementType,
                AchievedAt = DateTime.UtcNow
            };

            await _achievementRepository.CreateAsync(achievement, cancellationToken);
        }

        //public async Task DeleteAchievementAsync(int userId, AchievementType achievementType, CancellationToken cancellationToken = default)
        //{
        //    var achievement = await _achievementRepository.GetByUserIdAndTypeAsync(userId, achievementType, cancellationToken);
        //    await _achievementRepository.DeleteAsync(achievement, cancellationToken);
        //}
    }
}
