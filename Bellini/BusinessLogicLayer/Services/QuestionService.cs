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

        public async Task<QuestionDto> GetQuestionByIdAsync(int questionId, CancellationToken cancellationToken = default)
        {
            var question = await _questionRepository.GetItemAsync(questionId, cancellationToken);
            if (question == null)
            {
                throw new KeyNotFoundException("Question not found.");
            }

            return _mapper.Map<QuestionDto>(question);
        }

        public async Task<IEnumerable<QuestionDto>> GetQuestionsByGameIdAsync(int gameId, CancellationToken cancellationToken = default)
        {
            var questions = await _questionRepository.GetElementsAsync(cancellationToken);
            var filteredQuestions = questions.Where(q => q.GameId == gameId);

            return _mapper.Map<IEnumerable<QuestionDto>>(filteredQuestions);
        }

        public async Task<IEnumerable<QuestionDto>> GetAllQuestionsAsync(CancellationToken cancellationToken = default)
        {
            var questions = await _questionRepository.GetElementsAsync(cancellationToken);
            return _mapper.Map<IEnumerable<QuestionDto>>(questions);
        }
    }
}
