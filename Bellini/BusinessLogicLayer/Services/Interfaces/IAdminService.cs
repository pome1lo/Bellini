using BusinessLogicLayer.Services.DTOs;

namespace BusinessLogicLayer.Services.Interfaces
{
    public interface IAdminService
    {
        Task CreateUserAsync(AdminCreateUserDto createUserDto, CancellationToken cancellationToken = default);
        Task UpdateUserAsync(AdminUpdateUserDto updateUserDto, CancellationToken cancellationToken = default);
        Task DeleteUserAsync(int id, CancellationToken cancellationToken = default);

        Task CreateGameAsync(AdminCreateGameDto createGameDto, CancellationToken cancellationToken = default);
        Task UpdateGameAsync(AdminUpdateGameDto updateGameDto, CancellationToken cancellationToken = default);
        Task DeleteGameAsync(int id, CancellationToken cancellationToken = default);

        Task CreateQuizAsync(AdminCreateQuizDto createQuizDto, CancellationToken cancellationToken = default);
        Task UpdateQuizAsync(AdminUpdateQuizDto updateQuizDto, CancellationToken cancellationToken = default);
        Task DeleteQuizAsync(int id, CancellationToken cancellationToken = default);
    }
}
