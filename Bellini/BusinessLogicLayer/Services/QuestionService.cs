using AutoMapper;
using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using DataAccess.Data.Interfaces;
using DataAccessLayer.Models;

namespace BusinessLogicLayer.Services
{
    public class QuestionService : IQuestionService
    {
        private readonly IRepository<Question> _questionRepository;
        private readonly IRepository<AnswerOption> _answerRepository;
        private readonly IMapper _mapper;

        public QuestionService(IRepository<Question> questionRepository, IRepository<AnswerOption> answerRepository, IMapper mapper)
        {
            _questionRepository = questionRepository;
            _answerRepository = answerRepository;
            _mapper = mapper;
        }

        public async Task<int> CreateQuestionAsync(CreateQuestionDto createQuestionDto, CancellationToken cancellationToken = default)
        {
            var question = _mapper.Map<Question>(createQuestionDto);

            await _questionRepository.CreateAsync(question, cancellationToken);

            foreach (var answerDto in createQuestionDto.Answers)
            {
                var answer = _mapper.Map<AnswerOption>(answerDto);
                answer.QuestionId = question.Id;
                await _answerRepository.CreateAsync(answer, cancellationToken);
            }

            return question.Id;
        }
    }
}
