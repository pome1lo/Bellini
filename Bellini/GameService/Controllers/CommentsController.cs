using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
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

        // POST: api/comments/{gameId}
        [HttpPost("{gameId}")]
        public async Task<IActionResult> CreateComment(int gameId, [FromBody] CreateCommentDto createCommentDto, CancellationToken cancellationToken = default)
        {
            return Ok(
                await _commentService.CreateCommentAsync(gameId, createCommentDto, cancellationToken)
            );
        }

        // DELETE: api/comments/{commentId}
        [HttpDelete("{commentId}")]
        public async Task<IActionResult> DeleteComment(int commentId, CancellationToken cancellationToken = default)
        {
            return Ok(
                await _commentService.DeleteCommentAsync(commentId, cancellationToken)
            );
        }

        // GET: api/comments/game/{gameId}
        [HttpGet("game/{gameId}")]
        public async Task<IActionResult> GetCommentsByGameId(int gameId, CancellationToken cancellationToken = default)
        {
            return Ok(
                await _commentService.GetAllActiveGamesAsync(gameId, cancellationToken)
            );
        }
    }
}
