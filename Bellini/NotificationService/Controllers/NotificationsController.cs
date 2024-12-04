using BusinessLogicLayer.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace NotificationService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationsController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet("{userId:int}")]
        //[ProfileOwnerAuthorize(IdParameterName = "userId")]
        public async Task<IActionResult> GetNotificationsByUserId(int userId, [FromQuery] int limit = 10, [FromQuery] int offset = 0, CancellationToken cancellationToken = default)
        {
            var (notifications, totalCount) = await _notificationService.GetAllNotificationsForUserAsync(
                userId,
                limit,
                offset,
                cancellationToken);

            return Ok(new
            {
                TotalCount = totalCount,
                Items = notifications
            });
        }
    }
}
