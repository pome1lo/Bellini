using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ProfileService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AchievementsController : ControllerBase
    {
        private readonly IAchievementService _achievementService;

        public AchievementsController(IAchievementService achievementService)
        {
            _achievementService = achievementService;
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<AchievementDto>>> GetUserAchievements(int userId, CancellationToken cancellationToken)
        {
            return Ok(
                await _achievementService.GetUserAchievementsAsync(userId, cancellationToken)
            );
        }
    }
}
