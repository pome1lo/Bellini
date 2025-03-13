using BusinessLogicLayer.Services;
using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using UtilsModelsLibrary.Attributes;
using UtilsModelsLibrary.Enums;
using UtilsModelsLibrary.Extensions;

namespace GameService.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class QuestionsController : ControllerBase
    {
        private readonly IQuestionService _questionService;
        private readonly IUserStatisticsService _userStatisticsService;

        public QuestionsController(IQuestionService questionService, IUserStatisticsService userStatisticsService)
        {
            _questionService = questionService;
            _userStatisticsService = userStatisticsService;
        }

        [HttpPost]
        [RolesOnlyAuthorize(Roles.User)]
        public async Task<IActionResult> CreateQuestion([FromBody] CreateQuestionDto createQuestionDto, CancellationToken cancellationToken)
        {
            return Ok(
                new
                {
                    questionId = await _questionService.CreateQuestionAsync(createQuestionDto, cancellationToken),
                    achievement = await _userStatisticsService.UpdateUserStatisticsAsync
                    (
                        int.Parse(TokenHelper.GetParameterFromToken(HttpContext)),
                        UserActions.QuestionCreated, cancellationToken
                    )
                }
            );
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetQuestionById(int id, CancellationToken cancellationToken)
        {
            return Ok(
                await _questionService.GetQuestionByIdAsync(id, cancellationToken)
            );
        }

        [HttpGet]
        public async Task<IActionResult> GetAllQuestions(CancellationToken cancellationToken)
        {
            return Ok(
                await _questionService.GetAllQuestionsAsync(cancellationToken)
            );
        }

        [HttpGet("game/{gameId:int}")]
        public async Task<IActionResult> GetQuestionsByGameId(int gameId, CancellationToken cancellationToken)
        {
            return Ok(
                await _questionService.GetQuestionsByGameIdAsync(gameId, cancellationToken)
            );
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteQuestionById(int id, [FromBody] int gameId, CancellationToken cancellationToken)
        {
            await _questionService.DeleteQuestionAsync(id, gameId, cancellationToken);
            return Ok();
        }
    }
}
