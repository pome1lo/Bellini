using BusinessLogicLayer.Services;
using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using DataAccessLayer.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UtilsModelsLibrary.Attributes;
using UtilsModelsLibrary.Enums;
using UtilsModelsLibrary.Extensions;

namespace GameService.Controllers
{
    [ApiController]
    [Route("api/[controller]")] 
    public class GameController : ControllerBase
    {
        private readonly IGameService _gameService;
        private readonly IFileService _fileService;
        private readonly IUserStatisticsService _userStatisticsService;

        public GameController(IGameService gameService, IUserStatisticsService userStatisticsService, IFileService fileService)
        {
            _gameService = gameService;
            _userStatisticsService = userStatisticsService;
            _fileService = fileService;
        }

        [HttpPost("create")]
        [RolesOnlyAuthorize(Roles.User)]
        public async Task<IActionResult> CreateGame([FromBody] CreateGameRoomDto createGameRoomDto, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(
                new
                {
                    GameId = await _gameService.CreateGameRoomAsync(createGameRoomDto, cancellationToken),
                    achievement = await _userStatisticsService.UpdateUserStatisticsAsync(
                        int.Parse(TokenHelper.GetParameterFromToken(HttpContext)), 
                        UserActions.GameCreated, cancellationToken
                    )
                }
            );
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetGameById(int id, CancellationToken cancellationToken)
        {
            return Ok(
                await _gameService.GetGameByIdAsync(id, cancellationToken)
            );
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllActiveGames([FromQuery] int limit = 10, [FromQuery] int offset = 0, CancellationToken cancellationToken = default)
        {
            var (games, totalCount) = await _gameService.GetAllActiveGamesAsync(limit, offset, cancellationToken);
            return Ok(new { games, total = totalCount });
        }

        [HttpGet("all-data")]
        public async Task<IActionResult> GetAllGames([FromQuery] int limit = 10, [FromQuery] int offset = 0, CancellationToken cancellationToken = default)
        {
            var (games, totalCount) = await _gameService.GetAllGamesAsync(limit, offset, cancellationToken);
            return Ok(new { games, total = totalCount });
        }

        [HttpGet("{gameId}/statistics")]
        public async Task<IActionResult> GetGameStatistics(int gameId, CancellationToken cancellationToken)
        {
            return Ok(
                await _gameService.GetGameStatisticsAsync(gameId, cancellationToken)
            );
        }

        [HttpGet("{availability}")]
        public async Task<IActionResult> GetGamesByAvailability(GameStatusEnum availability, [FromQuery] int limit = 10, [FromQuery] int offset = 0, CancellationToken cancellationToken = default)
        {
            var (games, totalCount) = await _gameService.SelectGamesByAvailabilityAsync(availability, limit, offset, cancellationToken);
            return Ok(new { games, total = totalCount });
        }

        [HttpPost("{id:int}/start")]
        public async Task<IActionResult> StartGame(int id, [FromBody] StartGameDto startGameDto, CancellationToken cancellationToken)
        {
            return Ok(
                await _gameService.StartGame(id, startGameDto, cancellationToken)
            );
        }

        [HttpPost("{id:int}/end")]
        public async Task<IActionResult> EndGame(int id, CancellationToken cancellationToken)
        {
            await _gameService.CompleteGameAsync(id, cancellationToken);
            return Ok(
                new
                {
                    achievement = await _userStatisticsService.UpdateUserStatisticsAsync(
                        int.Parse(TokenHelper.GetParameterFromToken(HttpContext)),
                        UserActions.GameFinish, cancellationToken
                    )
                }
            );
        }

        [HttpPut("{id}")]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> UpdateQuiz(int id, [FromForm] UpdateGameDto updateGame, [FromForm] IFormFile? image, CancellationToken cancellationToken = default)
        {
            if (image is not null)
            {
                var imageUrl = await _fileService.UploadFileAsync(image, cancellationToken, FileTypeUpload.isQuizzesImageGameService, prefixName: $"quizzes/");

                var isDocker = Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true";
                updateGame.GameCoverImageUrl = (isDocker ? "/apigateway" : "https://localhost:7292") + imageUrl;
            }

            return Ok(
                await _gameService.UpdateGameAsync(id, updateGame, cancellationToken)
            );
        }
    }
}
