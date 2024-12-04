using DataAccessLayer.Services.DTOs;
using DataAccessLayer.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GameService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentsController : ControllerBase
    {
        private readonly ICommentService _commentService;

        public CommentsController(ICommentService commentService)
        {
            _commentService = commentService;
        }

        [HttpGet("game/{gameId:int}")]
        public async Task<IActionResult> GetCommentsByGameId(int gameId, CancellationToken cancellationToken = default)
        {
            return Ok(
                await _commentService.GetAllCommentsByGameIdAsync(gameId, cancellationToken)
            );
        }

        [HttpGet("quiz/{quizId:int}")]
        public async Task<IActionResult> GetCommentsByQuizId(int quizId, CancellationToken cancellationToken = default)
        {
            return Ok(
                await _commentService.GetAllCommentsByQuizIdAsync(quizId, cancellationToken)
            );
        }

        [HttpPost("game/{gameId:int}")]
        public async Task<IActionResult> CreateGameComment(int gameId, [FromBody] CreateGameCommentDto createCommentDto, CancellationToken cancellationToken = default)
        {
            return Ok(
                await _commentService.CreateGameCommentAsync(gameId, createCommentDto, cancellationToken)
            );
        }

        [HttpPost("quiz/{quizId:int}")]
        public async Task<IActionResult> CreateQuizComment(int quizId, [FromBody] CreateQuizCommentDto createCommentDto, CancellationToken cancellationToken = default)
        {
            return Ok(
                await _commentService.CreateQuizCommentAsync(quizId, createCommentDto, cancellationToken)
            );
        }

        [HttpDelete("{commentId:int}")]
        public async Task<IActionResult> DeleteComment(int commentId, CancellationToken cancellationToken = default)
        {
            return Ok(
                await _commentService.DeleteCommentAsync(commentId, cancellationToken)
            );
        }
    }
}
