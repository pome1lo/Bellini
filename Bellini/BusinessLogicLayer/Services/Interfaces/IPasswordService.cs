using BusinessLogicLayer.Services.DTOs;

namespace BusinessLogicLayer.Services.Interfaces
{
    public interface IPasswordService
    {
        /// <summary>
        /// Изменяет пароль пользователя.
        /// </summary>
        /// <param name="changePasswordDto">Данные для изменения пароля.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        Task ChangePasswordAsync(ChangePasswordDto changePasswordDto, CancellationToken cancellationToken = default);

        /// <summary>
        /// Сбрасывает пароль пользователя с использованием нового пароля и токена.
        /// </summary>
        /// <param name="resetPasswordDto">Данные для сброса пароля.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        Task ResetPasswordAsync(ResetPasswordDto resetPasswordDto, CancellationToken cancellationToken = default);

        /// <summary>
        /// Запрашивает сброс пароля, отправляя код подтверждения на email пользователя.
        /// </summary>
        /// <param name="forgotPasswordDto">Данные для запроса восстановления пароля.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Идентификатор запроса восстановления пароля.</returns>
        Task<int> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto, CancellationToken cancellationToken = default);

        /// <summary>
        /// Проверяет код подтверждения для восстановления пароля.
        /// </summary>
        /// <param name="verifyCodeDto">Данные для верификации кода.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Возвращает email пользователя, если код верен.</returns>
        Task<string> VerifyCodeAsync(VerifyCodeDto verifyCodeDto, CancellationToken cancellationToken = default);
    }
}
