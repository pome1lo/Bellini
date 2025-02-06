using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using DataAccessLayer.Utils;
using Microsoft.AspNetCore.Mvc;

namespace GameService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameController : ControllerBase
    {
        private readonly IGameService _gameService;

        public GameController(IGameService gameService)
        {
            _gameService = gameService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateGame([FromBody] CreateGameRoomDto createGameRoomDto, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(
                new
                {
                    GameId = await _gameService.CreateGameRoomAsync(createGameRoomDto, cancellationToken)
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
        public async Task<IActionResult> GetAllGames(CancellationToken cancellationToken = default)
        {
            return Ok(
                await _gameService.GetAllGamesAsync(cancellationToken)
            );
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
            return Ok();
        }
    }
}
