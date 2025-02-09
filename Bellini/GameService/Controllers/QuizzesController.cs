﻿using BusinessLogicLayer.Attributes;
using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GameService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizzesController : ControllerBase
    {
        private readonly IQuizService _quizService;

        public QuizzesController(IQuizService quizService)
        {
            _quizService = quizService;
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

        [HttpPost("{quizId:int}/end")]
        public async Task<IActionResult> EndQuiz(int quizId, [FromBody] QuizFinishedDto quizFinishedDto, CancellationToken cancellationToken = default)
        {
            return Ok(
                await _quizService.EndQuizAsync(quizId, quizFinishedDto, cancellationToken)
            );
        }
    }
}
