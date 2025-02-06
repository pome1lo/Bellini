using BusinessLogicLayer.Services.DTOs;

namespace BusinessLogicLayer.Services.Interfaces
{
    public interface IAdminService
    {
        Task CreateUserAsync(AdminCreateUserDto createUserDto, CancellationToken cancellationToken = default);
        Task UpdateUserAsync(AdminUpdateUserDto updateUserDto, CancellationToken cancellationToken = default);

        Task CreateGameAsync(AdminCreateGameDto createGameDto, CancellationToken cancellationToken = default);
        Task UpdateGameAsync(AdminUpdateGameDto updateGameDto, CancellationToken cancellationToken = default);

        Task CreateQuizAsync(AdminCreateQuizDto createQuizDto, CancellationToken cancellationToken = default);
        Task UpdateQuizAsync(AdminUpdateQuizDto updateQuizDto, CancellationToken cancellationToken = default);
    }
}
