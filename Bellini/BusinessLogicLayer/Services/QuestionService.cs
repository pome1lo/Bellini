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
        private readonly IRepository<GameQuestion> _gameQuestionRepository;
        private readonly IRepository<QuizQuestion> _quizQuestionRepository;
        private readonly IRepository<GameAnswerOption> _gameAnswerRepository;
        private readonly IRepository<QuizAnswerOption> _quizAnswerRepository;
        private readonly IRepository<Game> _gameRepository;
        private readonly IRepository<Quiz> _quizRepository;
        private readonly IMapper _mapper;

        public QuestionService(
            IRepository<GameQuestion> gameQuestionRepository, 
            IRepository<QuizQuestion> quizQuestionRepository, 
            IRepository<GameAnswerOption> gameAnswerRepository, 
            IRepository<QuizAnswerOption> quizAnswerRepository, 
            IRepository<Game> gameRepository, 
            IRepository<Quiz> quizRepository, 
            IMapper mapper)
        {
            _quizQuestionRepository = quizQuestionRepository;
            _gameQuestionRepository = gameQuestionRepository;
            _gameAnswerRepository = gameAnswerRepository;
            _quizAnswerRepository = quizAnswerRepository;
            _gameRepository = gameRepository;
            _quizRepository = quizRepository;
            _mapper = mapper;
        }

        public async Task<int> CreateQuestionAsync(CreateGameQuestionDto createQuestionDto, CancellationToken cancellationToken = default)
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

            var question = _mapper.Map<GameQuestion>(createQuestionDto);
            question.IsCustom = true;
            await _gameQuestionRepository.CreateAsync(question, cancellationToken);

            foreach (var answerDto in createQuestionDto.Answers)
            {
                var answer = _mapper.Map<GameAnswerOption>(answerDto);
                answer.QuestionId = question.Id;
                await _gameAnswerRepository.CreateAsync(answer, cancellationToken);
            }

            game.Questions.Add(question);
            await _gameRepository.UpdateAsync(game.Id, game, cancellationToken);

            return question.Id;
        }

        public async Task<QuestionDto> GetQuestionByIdAsync(int questionId, CancellationToken cancellationToken = default)
        {
            var question = await _gameQuestionRepository.GetItemAsync(questionId, cancellationToken);
            if (question is null)
            {
                throw new KeyNotFoundException("Question not found.");
            }

            return _mapper.Map<QuestionDto>(question);
        }

        public async Task<IEnumerable<QuestionDto>> GetQuestionsByGameIdAsync(int gameId, CancellationToken cancellationToken = default)
        {
            var questions = await _gameQuestionRepository.GetElementsAsync(cancellationToken);
            var filteredQuestions = questions.Where(q => q.GameId == gameId);

            return _mapper.Map<IEnumerable<QuestionDto>>(filteredQuestions);
        }

        public async Task<IEnumerable<QuestionDto>> GetAllQuestionsAsync(CancellationToken cancellationToken = default)
        {
            var questions = await _gameQuestionRepository.GetElementsAsync(cancellationToken);
            return _mapper.Map<IEnumerable<QuestionDto>>(questions);
        }

        public async Task DeleteGameQuestionAsync(int questionId, int gameId, CancellationToken cancellationToken = default)
        {
            var game = await _gameRepository.GetItemAsync(gameId, cancellationToken);
            if (game is null)
            {
                throw new NotFoundException("Game not found.");
            }

            var question = await _gameQuestionRepository.GetItemAsync(questionId, cancellationToken);
            if (question is null || question.GameId != gameId)
            {
                throw new NotFoundException("Question not found or does not belong to the game.");
            }

            var answerOptions = await _gameAnswerRepository.GetElementsAsync(cancellationToken);
            var answersToDelete = answerOptions.Where(a => a.QuestionId == questionId).ToList();

            foreach (var answer in answersToDelete)
            {
                await _gameAnswerRepository.DeleteAsync(answer.Id, cancellationToken);
            }

            await _gameQuestionRepository.DeleteAsync(questionId, cancellationToken);

            game.Questions.Remove(question);

            await _gameRepository.UpdateAsync(game.Id, game, cancellationToken);
        }

        public async Task DeleteQuizQuestionAsync(int questionId, int quizId, CancellationToken cancellationToken = default)
        {
            var quiz = await _quizRepository.GetItemAsync(quizId, cancellationToken);
            if (quiz is null)
            {
                throw new NotFoundException("Quiz not found.");
            }

            var question = await _quizQuestionRepository.GetItemAsync(questionId, cancellationToken);
            if (question is null || question.QuizId != quizId)
            {
                throw new NotFoundException("Question not found or does not belong to the quiz.");
            }

            var answerOptions = await _quizAnswerRepository.GetElementsAsync(cancellationToken);
            var answersToDelete = answerOptions.Where(a => a.QuizQuestionId == questionId).ToList();

            foreach (var answer in answersToDelete)
            {
                await _quizAnswerRepository.DeleteAsync(answer.Id, cancellationToken);
            }

            await _quizQuestionRepository.DeleteAsync(questionId, cancellationToken);

            quiz.Questions.Remove(question);

            await _quizRepository.UpdateAsync(quiz.Id, quiz, cancellationToken);
        }


        public async Task<int> CreateQuizQuestionAsync(CreateQuizQuestionDto createQuestionDto, CancellationToken cancellationToken = default)
        {
            var correctAnswers = createQuestionDto.Answers.Count(a => a.IsCorrect);
            if (correctAnswers != 1)
            {
                throw new IncorrectNumberOfAnswersException("Each question must have exactly one correct answer.");
            }

            var quiz = await _quizRepository.GetItemAsync(createQuestionDto.QuizId, cancellationToken);
            if (quiz is null)
            {
                throw new NotFoundException("Game not found.");
            }

            var question = _mapper.Map<QuizQuestion>(createQuestionDto);

            await _quizQuestionRepository.CreateAsync(question, cancellationToken);

            foreach (var answerDto in createQuestionDto.Answers)
            {
                var answer = _mapper.Map<QuizAnswerOption>(answerDto);
                answer.QuizQuestionId = question.Id;
                await _quizAnswerRepository.CreateAsync(answer, cancellationToken);
            }

            quiz.Questions.Add(question);
            await _quizRepository.UpdateAsync(quiz.Id, quiz, cancellationToken);

            return question.Id;
        }
    }
}
