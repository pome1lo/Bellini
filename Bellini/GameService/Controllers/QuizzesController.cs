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
        public async Task<IActionResult> GetAllQuizzes(CancellationToken cancellationToken)
        {
            return Ok(
                await _quizService.GetAllQuizzesAsync(cancellationToken)
            );
        }

        [HttpGet("{quizId:int}")]
        public async Task<IActionResult> GetQuizByQuizId(int quizId, CancellationToken cancellationToken)
        {
            return Ok(
                _quizService.GetQuizByIdAsync(quizId, cancellationToken)
            );
        }
    }
}
