using BusinessLogicLayer.Services;
using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using DataAccessLayer.Models;
using Microsoft.AspNetCore.Mvc;
using UtilsModelsLibrary.Attributes;
using UtilsModelsLibrary.Enums;
using UtilsModelsLibrary.Extensions;

namespace GameService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentsController : ControllerBase
    {
        private readonly ICommentService _commentService;
        private readonly IUserStatisticsService _userStatisticsService;

        public CommentsController(ICommentService commentService, IUserStatisticsService userStatisticsService)
        {
            _commentService = commentService;
            _userStatisticsService = userStatisticsService;
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
        [RolesOnlyAuthorize(Roles.User)]
        public async Task<IActionResult> CreateGameComment(int gameId, [FromBody] CreateGameCommentDto createCommentDto, CancellationToken cancellationToken = default)
        {
            return Ok(
                new
                {
                    commentId = await _commentService.CreateGameCommentAsync(gameId, createCommentDto, cancellationToken),
                    achievement = await _userStatisticsService.UpdateUserStatisticsAsync
                    (
                        int.Parse(TokenHelper.GetParameterFromToken(HttpContext)),
                        UserActions.GameComment, cancellationToken
                    )
                }
            );
        }

        [HttpPost("quiz/{quizId:int}")]
        [RolesOnlyAuthorize(Roles.User)]
        public async Task<IActionResult> CreateQuizComment(int quizId, [FromBody] CreateQuizCommentDto createCommentDto, CancellationToken cancellationToken = default)
        {
            return Ok(
                new
                {
                    commentId = await _commentService.CreateQuizCommentAsync(quizId, createCommentDto, cancellationToken),
                    achievement = await _userStatisticsService.UpdateUserStatisticsAsync
                    (
                        int.Parse(TokenHelper.GetParameterFromToken(HttpContext)),
                        UserActions.QuizComment, cancellationToken
                    )
                }
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
