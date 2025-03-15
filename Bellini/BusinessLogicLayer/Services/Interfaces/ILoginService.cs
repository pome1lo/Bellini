using BusinessLogicLayer.Services.DTOs;
using DataAccessLayer.Models;

namespace BusinessLogicLayer.Services.Interfaces
{
    public interface ILoginService
    {
        /// <summary>
        /// Аутентифицирует пользователя и выдает токен доступа.
        /// </summary>
        /// <param name="loginDto">Данные для входа.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Токен доступа и обновления.</returns>
        Task<TokenDto> AuthenticateAsync(LoginDto loginDto, CancellationToken cancellationToken = default);

        /// <summary>
        /// Обновляет токен доступа с использованием refresh-токена.
        /// </summary>
        /// <param name="refreshToken">Обновляющий токен.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Обновленный токен доступа и новый refresh-токен.</returns>
        Task<TokenDto> RefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default);

        /// <summary>
        /// Генерирует refresh-токен для пользователя.
        /// </summary>
        /// <param name="user">Пользователь, для которого создается refresh-токен.</param>
        /// <returns>Сгенерированный refresh-токен.</returns>
        string GenerateRefreshToken(User user);

        /// <summary>
        /// Генерирует access-токен для пользователя.
        /// </summary>
        /// <param name="user">Пользователь, для которого создается access-токен.</param>
        /// <returns>Сгенерированный access-токен.</returns>
        string GenerateAccessToken(User user);
    }
}
