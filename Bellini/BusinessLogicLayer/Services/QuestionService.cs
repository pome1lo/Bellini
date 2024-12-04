using AutoMapper;
using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Models;
using UtilsModelsLibrary.Exceptions;

namespace BusinessLogicLayer.Services
{
    public class QuestionService : IQuestionService
    {
        private readonly IRepository<Question> _questionRepository;
        private readonly IRepository<AnswerOption> _answerRepository;
        private readonly IRepository<Game> _gameRepository;
        private readonly IMapper _mapper;

        public QuestionService(IRepository<Question> questionRepository, IRepository<AnswerOption> answerRepository, IRepository<Game> gameRepository, IMapper mapper)
        {
            _questionRepository = questionRepository;
            _answerRepository = answerRepository;
            _gameRepository = gameRepository;
            _mapper = mapper;
        }

        public async Task<int> CreateQuestionAsync(CreateQuestionDto createQuestionDto, CancellationToken cancellationToken = default)
        {
            var correctAnswers = createQuestionDto.Answers.Count(a => a.IsCorrect);
            if (correctAnswers != 1)
            {
                throw new IncorrectNumberOfAnswersException("Each question must have exactly one correct answer.");
            }

            var game = await _gameRepository.GetItemAsync(createQuestionDto.GameId, cancellationToken);
            if (game is null)
            {
                throw new NotFoundException("Game not found.");
            }

            var question = _mapper.Map<Question>(createQuestionDto);
            question.IsCustom = true;
            await _questionRepository.CreateAsync(question, cancellationToken);

            foreach (var answerDto in createQuestionDto.Answers)
            {
                var answer = _mapper.Map<AnswerOption>(answerDto);
                answer.QuestionId = question.Id;
                await _answerRepository.CreateAsync(answer, cancellationToken);
            }

            game.Questions.Add(question);
            await _gameRepository.UpdateAsync(game.Id, game, cancellationToken);

            return question.Id;
        }

        public async Task<QuestionDto> GetQuestionByIdAsync(int questionId, CancellationToken cancellationToken = default)
        {
            var question = await _questionRepository.GetItemAsync(questionId, cancellationToken);
            if (question is null)
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

        public async Task DeleteQuestionAsync(int questionId, int gameId, CancellationToken cancellationToken = default)
        {
            var game = await _gameRepository.GetItemAsync(gameId, cancellationToken);
            if (game is null)
            {
                throw new NotFoundException("Game not found.");
            }

            var question = await _questionRepository.GetItemAsync(questionId, cancellationToken);
            if (question is null || question.GameId != gameId)
            {
                throw new NotFoundException("Question not found or does not belong to the game.");
            }

            var answerOptions = await _answerRepository.GetElementsAsync(cancellationToken);
            var answersToDelete = answerOptions.Where(a => a.QuestionId == questionId).ToList();

            foreach (var answer in answersToDelete)
            {
                await _answerRepository.DeleteAsync(answer.Id, cancellationToken);
            }

            await _questionRepository.DeleteAsync(questionId, cancellationToken);

            game.Questions.Remove(question);

            await _gameRepository.UpdateAsync(game.Id, game, cancellationToken);
        }
    }
}
