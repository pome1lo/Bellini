using BusinessLogicLayer.Services.DTOs;

namespace BusinessLogicLayer.Services.Interfaces
{
    public interface IProfileService
    {
        Task<ProfileDto> GetProfileByIdAsync(int profileId, CancellationToken cancellationToken = default);
        Task<IEnumerable<ProfileDto>> GetAllProfilesAsync(CancellationToken cancellationToken = default);
        Task UpdateProfileAsync(int profileId, UpdateProfileDto updateProfileDto, CancellationToken cancellationToken = default);
        Task DeleteProfileAsync(int profileId, CancellationToken cancellationToken = default);
    }
}
