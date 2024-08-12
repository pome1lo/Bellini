using BusinessLogic.DTO;

namespace BusinessLogic.Interfaces
{
    public interface IUserService
    {
        Task<UserDto> GetUserByIdAsync(int userId, CancellationToken cancellationToken = default);
        Task<IEnumerable<UserDto>> GetAllUsersAsync(CancellationToken cancellationToken = default);
        Task<UserDto> CreateUserAsync(UserDto newUser, CancellationToken cancellationToken = default);
        Task UpdateUserAsync(int userId, UserDto updatedUser, CancellationToken cancellationToken = default);
        Task DeleteUserAsync(int userId, CancellationToken cancellationToken = default);
    }
}
