using BusinessLogicLayer.Services.DTOs;
using DataAccessLayer.Models;
using DataAccessLayer.Utils;
using Microsoft.AspNetCore.Mvc;

namespace BusinessLogicLayer.Services.Interfaces
{
    public interface IGameService
    {
        /// <summary>
        /// Создает игровую комнату.
        /// </summary>
        /// <param name="createGameRoomDto">Данные для создания игровой комнаты.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Идентификатор созданной игровой комнаты.</returns>
        Task<int> CreateGameRoomAsync(CreateGameRoomDto createGameRoomDto, CancellationToken cancellationToken = default);

        /// <summary>
        /// Получает игру по ее идентификатору.
        /// </summary>
        /// <param name="gameId">Идентификатор игры.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Данные об игре.</returns>
        Task<GameDto> GetGameByIdAsync(int gameId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Получает список активных игр с пагинацией.
        /// </summary>
        /// <param name="limit">Количество элементов на странице.</param>
        /// <param name="offset">Смещение для пагинации.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Список активных игр и общее количество.</returns>
        Task<(IEnumerable<GameDto> Games, int TotalCount)> GetAllActiveGamesAsync(int limit, int offset, CancellationToken cancellationToken = default);

        /// <summary>
        /// Фильтрует игры по доступности с пагинацией.
        /// </summary>
        /// <param name="availability">Статус доступности игр.</param>
        /// <param name="limit">Количество элементов на странице.</param>
        /// <param name="offset">Смещение для пагинации.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Список игр с указанной доступностью и общее количество.</returns>
        Task<(IEnumerable<GameDto> Games, int TotalCount)> SelectGamesByAvailabilityAsync(GameStatusEnum availability, int limit, int offset, CancellationToken cancellationToken = default);

        /// <summary>
        /// Запускает игру.
        /// </summary>
        /// <param name="id">Идентификатор игры.</param>
        /// <param name="startGameDto">Данные для запуска игры.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Данные о запущенной игре.</returns>
        Task<StartedGameDto> StartGame(int id, [FromBody] StartGameDto startGameDto, CancellationToken cancellationToken = default);

        /// <summary>
        /// Заверш

    }
}
