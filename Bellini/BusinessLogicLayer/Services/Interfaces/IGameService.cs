using BusinessLogicLayer.Services.DTOs;

namespace BusinessLogicLayer.Services.Interfaces
{
    public interface IGameService
    {
        Task<int> CreateGameRoomAsync(CreateGameRoomDto createGameRoomDto, CancellationToken cancellationToken = default);
        Task<GameDto> GetGameByIdAsync(int gameId, CancellationToken cancellationToken = default);
        Task<IEnumerable<GameDto>> GetAllActiveGamesAsync(CancellationToken cancellationToken = default);
        Task UpdateGameAsync(int gameId, UpdateGameDto updateGameDto, CancellationToken cancellationToken = default);
        Task EndGameAsync(int gameId, CancellationToken cancellationToken = default);
        Task JoinGameAsync(int gameId, int playerId, CancellationToken cancellationToken = default);
        Task LeaveGameAsync(int gameId, int playerId, CancellationToken cancellationToken = default);
        //Task<IEnumerable<PlayerDto>> GetPlayersInGameAsync(int gameId, CancellationToken cancellationToken = default);
        Task SelectCategoriesAndDifficultyAsync(int gameId, SelectCategoriesDto selectCategoriesDto, CancellationToken cancellationToken = default);
        Task AddCommentToGameAsync(int gameId, AddCommentDto addCommentDto, CancellationToken cancellationToken = default);
        Task<IEnumerable<CommentDto>> GetCommentsForGameAsync(int gameId, CancellationToken cancellationToken = default);
    }
}
