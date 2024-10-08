using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
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

        // �������� ����� ������� �������
        [HttpPost("create")]
        public async Task<IActionResult> CreateGame([FromBody] CreateGameRoomDto createGameRoomDto, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var gameId = await _gameService.CreateGameRoomAsync(createGameRoomDto, cancellationToken);
            return Ok(new { GameId = gameId });
        }

        // ��������� ���� �� ID
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetGameById(int id, CancellationToken cancellationToken)
        {
            var game = await _gameService.GetGameByIdAsync(id, cancellationToken);
            if (game == null)
                return NotFound();

            return Ok(game);
        }

        // ��������� ���� �������� ���
        [HttpGet("active")]
        public async Task<IActionResult> GetAllActiveGames(CancellationToken cancellationToken)
        {
            var activeGames = await _gameService.GetAllActiveGamesAsync(cancellationToken);
            return Ok(activeGames);
        }

        // ���������� ���������� �� ����
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGame(int id, [FromBody] UpdateGameDto updateGameDto, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _gameService.UpdateGameAsync(id, updateGameDto, cancellationToken);
            return NoContent();
        }

        // ���������� ����
        [HttpPost("{id}/end")]
        public async Task<IActionResult> EndGame(int id, CancellationToken cancellationToken)
        {
            await _gameService.EndGameAsync(id, cancellationToken);
            return NoContent();
        }

        // ������������� ������ � ����
        [HttpPost("{id}/join")]
        public async Task<IActionResult> JoinGame(int id, [FromBody] int playerId, CancellationToken cancellationToken)
        {
            await _gameService.JoinGameAsync(id, playerId, cancellationToken);
            return Ok();
        }

        // ���� ������ �� ����
        [HttpPost("{id}/leave")]
        public async Task<IActionResult> LeaveGame(int id, [FromBody] int playerId, CancellationToken cancellationToken)
        {
            await _gameService.LeaveGameAsync(id, playerId, cancellationToken);
            return Ok();
        }

        //// ��������� ������ ������� � ����
        //[HttpGet("{id}/players")]
        //public async Task<IActionResult> GetPlayersInGame(int id, CancellationToken cancellationToken)
        //{
        //    var players = await _gameService.GetPlayersInGameAsync(id, cancellationToken);
        //    return Ok(players);
        //}

        // ���������� ����������� � ����
        [HttpPost("{id}/comment")]
        public async Task<IActionResult> AddCommentToGame(int id, [FromBody] AddCommentDto addCommentDto, CancellationToken cancellationToken)
        {
            await _gameService.AddCommentToGameAsync(id, addCommentDto, cancellationToken);
            return Ok();
        }

        // ��������� ���� ������������ ��� ����
        [HttpGet("{id}/comments")]
        public async Task<IActionResult> GetCommentsForGame(int id, CancellationToken cancellationToken)
        {
            var comments = await _gameService.GetCommentsForGameAsync(id, cancellationToken);
            return Ok(comments);
        }

        // ����� ��������� � ������ ���������
        [HttpPost("{id}/select-categories")]
        public async Task<IActionResult> SelectCategoriesAndDifficulty(int id, [FromBody] SelectCategoriesDto selectCategoriesDto, CancellationToken cancellationToken)
        {
            await _gameService.SelectCategoriesAndDifficultyAsync(id, selectCategoriesDto, cancellationToken);
            return Ok();
        }
    }
}
