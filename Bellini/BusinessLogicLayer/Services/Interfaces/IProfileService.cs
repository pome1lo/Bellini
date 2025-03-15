using BusinessLogicLayer.Services.DTOs;

namespace BusinessLogicLayer.Services.Interfaces
{
    public interface IProfileService
    {
        /// <summary>
        /// Получает профиль пользователя по его идентификатору.
        /// </summary>
        /// <param name="profileId">Идентификатор профиля.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Данные профиля пользователя.</returns>
        Task<ProfileDto> GetUserByIdAsync(int profileId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Получает профиль пользователя по его идентификатору пользователя.
        /// </summary>
        /// <param name="profileId">Идентификатор пользователя.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Данные профиля пользователя.</returns>
        Task<UserProfileDto> GetProfileByUserIdAsync(int profileId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Получает список всех профилей с пагинацией.
        /// </summary>
        /// <param name="limit">Количество профилей на странице.</param>
        /// <param name="offset">Смещение для пагинации.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Список профилей и их общее количество.</returns>
        Task<(IEnumerable<ProfileDto> Users, int TotalCount)> GetAllProfilesAsync(int limit, int offset, CancellationToken cancellationToken = default);

        /// <summary>
        /// Обновляет профиль пользователя.
        /// </summary>
        /// <param name="profileId">Идентификатор профиля.</param>
        /// <param name="updateProfileDto">Данные для обновления профиля.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Обновленный профиль пользователя.</returns>
        Task<ProfileDto> UpdateProfileAsync(int profileId, UpdateProfileDto updateProfileDto, CancellationToken cancellationToken = default);

        /// <summary>
        /// Удаляет профиль пользователя.
        /// </summary>
        /// <param name="profileId">Идентификатор профиля.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        Task DeleteProfileAsync(int profileId, CancellationToken cancellationToken = default);

    }
}
