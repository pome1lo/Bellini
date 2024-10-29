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


        [HttpGet("{quizId:int}")]
        public async Task<IActionResult> GetQuizByQuizId(int quizId, CancellationToken cancellationToken)
        {
            return Ok(
                await _quizService.GetQuizByIdAsync(quizId, cancellationToken)
            );
        }
    }
}
