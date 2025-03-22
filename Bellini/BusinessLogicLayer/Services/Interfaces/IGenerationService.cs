using BusinessLogicLayer.Services.DTOs;

namespace BusinessLogicLayer.Services.Interfaces
{
    public interface IGenerationService
    {
        /// <summary>
        /// Генерирует викторину на основе темы и количества вопросов.
        /// </summary>
        /// <param name="topic">Тема викторины.</param>
        /// <param name="questionCount">Количество вопросов.</param>
        /// <returns>Сгенерированная викторина.</returns>
        Task<QuizDto> GenerateQuizAsync(string topic, int questionCount);

        /// <summary>
        /// Генерирует один вопрос для викторины на заданную тему.
        /// </summary>
        /// <param name="topic">Тема вопроса.</param>
        /// <returns>Сгенерированный вопрос.</returns>
        Task<QuestionDto> GenerateQuestionAsync(string topic);
    }
}
