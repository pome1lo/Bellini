using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;

namespace BusinessLogicLayer.Services
{
    public class GenerationService : IGenerationService
    {
        public Task<QuestionDto> GenerateQuestionAsync(string topic)
        {
            throw new NotImplementedException();
        }

        public Task<QuizDto> GenerateQuizAsync(string topic, int questionCount)
        {
            throw new NotImplementedException();
        }
    }
}
