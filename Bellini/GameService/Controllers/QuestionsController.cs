using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GameService.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class QuestionsController : ControllerBase
    {
        private readonly IQuestionService _questionService;

        public QuestionsController(IQuestionService questionService)
        {
            _questionService = questionService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateQuestion([FromBody] CreateQuestionDto createQuestionDto, CancellationToken cancellationToken)
        {
            var questionId = await _questionService.CreateQuestionAsync(createQuestionDto, cancellationToken);
            return Ok(questionId);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetQuestionById(int id, CancellationToken cancellationToken)
        {
            var question = await _questionService.GetQuestionByIdAsync(id, cancellationToken);
            return Ok(question);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllQuestions(CancellationToken cancellationToken)
        {
            var questions = await _questionService.GetAllQuestionsAsync(cancellationToken);
            return Ok(questions);
        }

        [HttpGet("game/{gameId:int}")]
        public async Task<IActionResult> GetQuestionsByGameId(int gameId, CancellationToken cancellationToken)
        {
            var questions = await _questionService.GetQuestionsByGameIdAsync(gameId, cancellationToken);
            return Ok(questions);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteQuestionById(int id, [FromBody] int gameId, CancellationToken cancellationToken)
        {
            await _questionService.DeleteQuestionAsync(id, gameId, cancellationToken);
            return Ok();
        }
    }
}
