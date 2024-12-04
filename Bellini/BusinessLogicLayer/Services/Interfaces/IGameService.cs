using DataAccessLayer.Services.DTOs;
using DataAccessLayer.Models;
using DataAccessLayer.Utils;
using Microsoft.AspNetCore.Mvc;

namespace DataAccessLayer.Services.Interfaces
{
    public interface IGameService
    {
        Task<int> CreateGameRoomAsync(CreateGameRoomDto createGameRoomDto, CancellationToken cancellationToken = default);
        Task<GameDto> GetGameByIdAsync(int gameId, CancellationToken cancellationToken = default);
        Task<(IEnumerable<GameDto> Games, int TotalCount)> GetAllActiveGamesAsync(int limit, int offset, CancellationToken cancellationToken = default);
        Task<(IEnumerable<GameDto> Games, int TotalCount)> SelectGamesByAvailabilityAsync(GameStatusEnum availability, int limit, int offset, CancellationToken cancellationToken = default);
        Task<StartedGameDto> StartGame(int id, [FromBody] StartGameDto startGameDto, CancellationToken cancellationToken = default);
        Task CompleteGameAsync(int gameId, CancellationToken cancellationToken = default);
    }
}
