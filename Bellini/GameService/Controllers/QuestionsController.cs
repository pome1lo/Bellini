using BusinessLogicLayer.Services;
using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using UtilsModelsLibrary.Attribute;
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
        private readonly IFileService _fileService;

        public QuestionsController(IQuestionService questionService, IUserStatisticsService userStatisticsService, IFileService fileService)
        {
            _questionService = questionService;
            _userStatisticsService = userStatisticsService;
            _fileService = fileService;
        }

        [HttpPost("game")]
        [ApiExplorerSettings(IgnoreApi = true)]
        [RolesOnlyAuthorize(Roles.User)]
        public async Task<IActionResult> CreateQuestion([FromForm] CreateGameQuestionDto createQuestionDto, [FromForm] IFormFile? image, CancellationToken cancellationToken)
        {
            if (image is not null)
            {
                var questionImage = await _fileService.UploadFileAsync(image, cancellationToken, FileTypeUpload.isQuestionImageGameService, prefixName: $"question/");

                var isDocker = Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true";
                createQuestionDto.QuestionImageUrl = (isDocker ? "/apigateway" : "https://localhost:7292") + questionImage;
            }

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

        [HttpPost("quiz")]
        [ApiExplorerSettings(IgnoreApi = true)]
        [RolesOnlyAuthorize(Roles.User)]
        public async Task<IActionResult> CreateQuestion([FromForm] CreateQuizQuestionDto createQuestionDto, [FromForm] IFormFile? image, CancellationToken cancellationToken)
        {
            if (image is not null)
            {
                var questionImage = await _fileService.UploadFileAsync(image, cancellationToken, FileTypeUpload.isQuestionImageGameService, prefixName: $"question/");

                var isDocker = Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true";
                createQuestionDto.QuizQuestionImageUrl = (isDocker ? "/apigateway" : "https://localhost:7292") + questionImage;
            }

            return Ok(
                await _questionService.CreateQuizQuestionAsync(createQuestionDto, cancellationToken)
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

        [HttpDelete("game/{id:int}")]
        public async Task<IActionResult> DeleteGameQuestionById(int id, [FromBody] int gameId, CancellationToken cancellationToken)
        {
            await _questionService.DeleteGameQuestionAsync(id, gameId, cancellationToken);
            return Ok();
        }

        [HttpDelete("quiz/{id:int}")]
        public async Task<IActionResult> DeleteQuizQuestionById(int id, [FromBody] int quizId, CancellationToken cancellationToken)
        {
            await _questionService.DeleteQuizQuestionAsync(id, quizId, cancellationToken);
            return Ok();
        }
    }
}
