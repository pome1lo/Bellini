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

            var gameId = await _gameService.CreateGameRoomAsync(createGameRoomDto, cancellationToken);
            return Ok(new { GameId = gameId });
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetGameById(int id, CancellationToken cancellationToken)
        {
            var game = await _gameService.GetGameByIdAsync(id, cancellationToken);
            if (game is null)
                return NotFound();

            return Ok(game);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllActiveGames([FromQuery] int limit = 10, [FromQuery] int offset = 0, CancellationToken cancellationToken = default)
        {
            var (games, totalCount) = await _gameService.GetAllActiveGamesAsync(limit, offset, cancellationToken);
            return Ok(new { games, total = totalCount });
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
