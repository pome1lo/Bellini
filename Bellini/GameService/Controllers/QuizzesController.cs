using BusinessLogicLayer.Services;
using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using DataAccessLayer.Models;
using Microsoft.AspNetCore.Mvc;
using UtilsModelsLibrary.Attribute;
using UtilsModelsLibrary.Attributes;
using UtilsModelsLibrary.Enums;
using UtilsModelsLibrary.Extensions;

namespace GameService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizzesController : ControllerBase
    {
        private readonly IQuizService _quizService;
        private readonly IUserStatisticsService _userStatisticsService;

        public QuizzesController(IQuizService quizService, IUserStatisticsService userStatisticsService)
        {
            _quizService = quizService;
            _userStatisticsService = userStatisticsService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllQuizzes([FromQuery] int limit = 10, [FromQuery] int offset = 0, [FromQuery] int userId = 0, CancellationToken cancellationToken = default)
        {
            var (quizzes, totalCount) = await _quizService.GetAllQuizzesAsync(limit, offset, userId, cancellationToken);
            return Ok(new { quizzes, total = totalCount });
        }

        [HttpGet("all-data")]
        public async Task<IActionResult> GetAllQuizzes([FromQuery] int limit = 10, [FromQuery] int offset = 0, CancellationToken cancellationToken = default)
        {
            var (quizzes, totalCount) = await _quizService.GetAllQuizzesAsync(limit, offset, cancellationToken);
            return Ok(new { quizzes, total = totalCount });
        }

        // refacotr
        [HttpGet("{quizId:int}")]
        public async Task<IActionResult> GetQuizByQuizId(int quizId, CancellationToken cancellationToken)
        {
            var quiz = await _quizService.GetQuizByIdAsync(quizId, cancellationToken);
            return quiz == null ? NotFound() : Ok(quiz);
        }

        [HttpGet("rating")]
        public async Task<IActionResult> GetQuizRating(CancellationToken cancellationToken)
        {
            return Ok(
                await _quizService.GetQuizRatingAsync(cancellationToken)
            );
        }

        [HttpPost("{quizId:int}/start")]
        [ProfileOwnerAuthorizeFromBody(UserIdPropertyName = "userId")]
        public async Task<IActionResult> StartQuiz(int quizId, [FromBody] QuizStartDto quizStart, CancellationToken cancellationToken = default)
        {
            return Ok(
                await _quizService.StartQuizAsync(quizId, quizStart.UserId, cancellationToken)
            );
        }
        
        [HttpPost("{quizId:int}/replay")]
        [RolesOnlyAuthorize(Roles.User)]
        public async Task<IActionResult> ReplayQuiz(int quizId, CancellationToken cancellationToken = default)
        {
            await _quizService.ReplayQuizAsync(quizId, int.Parse(TokenHelper.GetParameterFromToken(HttpContext)), cancellationToken);
            return NoContent();
        }

        [HttpPost("{quizId:int}/end")]
        public async Task<IActionResult> EndQuiz(int quizId, [FromBody] QuizFinishedDto quizFinishedDto, CancellationToken cancellationToken = default)
        {
            return Ok(
                new
                {
                    quiz = await _quizService.EndQuizAsync(quizId, quizFinishedDto, cancellationToken),
                    achievement = await _userStatisticsService.UpdateUserStatisticsAsync
                    (
                        int.Parse(TokenHelper.GetParameterFromToken(HttpContext)),
                        UserActions.QuizzFinish, cancellationToken
                    )
                }
            );
        }
    }
}
