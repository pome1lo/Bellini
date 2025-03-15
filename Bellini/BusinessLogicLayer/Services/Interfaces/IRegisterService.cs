using BusinessLogicLayer.Services.DTOs;

namespace BusinessLogicLayer.Services.Interfaces
{
    public interface IRegisterService
    {
        /// <summary>
        /// Проверяет, зарегистрирован ли уже указанный email.
        /// </summary>
        /// <param name="checkEmailDto">Данные для проверки email.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Завершается без возвращаемого значения, но может выбросить исключение, если email уже существует.</returns>
        Task CheckEmailAsync(CheckEmailDto checkEmailDto, CancellationToken cancellationToken = default);

        /// <summary>
        /// Проверяет код для верификации пользователя.
        /// </summary>
        /// <param name="verifyCodeDto">Данные для проверки верификационного кода.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Завершается без возвращаемого значения, но может выбросить исключение, если код неверен.</returns>
        Task VerifyCodeAsync(VerifyCodeDto verifyCodeDto, CancellationToken cancellationToken = default);

        /// <summary>
        /// Регистрирует нового пользователя.
        /// </summary>
        /// <param name="registerDto">Данные для регистрации нового пользователя.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Завершается без возвращаемого значения, но может выбросить исключение, если регистрация не удалась.</returns>
        Task RegisterUserAsync(RegisterDto registerDto, CancellationToken cancellationToken = default);

    }
}
