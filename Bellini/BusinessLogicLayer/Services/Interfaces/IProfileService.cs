using BusinessLogicLayer.Services.DTOs;

namespace BusinessLogicLayer.Services.Interfaces
{
    public interface IProfileService
    {
        Task<ProfileDto> GetUserByIdAsync(int profileId, CancellationToken cancellationToken = default);
        Task<UserProfileDto> GetProfileByUserIdAsync(int profileId, CancellationToken cancellationToken = default);
        Task<(IEnumerable<ProfileDto> Users, int TotalCount)> GetAllProfilesAsync(int limit, int offset, CancellationToken cancellationToken = default);
        Task<ProfileDto> UpdateProfileAsync(int profileId, UpdateProfileDto updateProfileDto, CancellationToken cancellationToken = default);
        Task DeleteProfileAsync(int profileId, CancellationToken cancellationToken = default);
    }
}
