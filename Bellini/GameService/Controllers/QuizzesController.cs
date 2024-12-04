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

        [HttpPost("{quizId:int}/start")]
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
