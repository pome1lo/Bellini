using AutoMapper;
using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Models;
using FluentValidation;
using Microsoft.Extensions.Caching.Distributed;
using UtilsModelsLibrary.Exceptions;

namespace BusinessLogicLayer.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IRepository<User> _userRepository;
        private readonly IMapper _mapper;
        private readonly INotificationService _notificationService;
        private readonly IValidator<ProfileDto> _profileValidator;
        private readonly IValidator<UpdateProfileDto> _updateProfileValidator;
        private readonly IDistributedCache _cache;

        public ProfileService(
            IRepository<User> userRepository,
            IMapper mapper,
            INotificationService notificationService,
            IValidator<ProfileDto> profileValidator,
            IValidator<UpdateProfileDto> updateProfileValidator,
            IDistributedCache cache)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _profileValidator = profileValidator;
            _updateProfileValidator = updateProfileValidator;
            _cache = cache;
            _notificationService = notificationService;
        }

        public async Task<ProfileDto> GetProfileByIdAsync(int profileId, CancellationToken cancellationToken = default)
        {
            var user = await _userRepository.GetItemAsync(profileId, cancellationToken);

            if (user is null)
            {
                throw new NotFoundException($"Profile with ID {profileId} not found.");
            }

            return _mapper.Map<ProfileDto>(user);
        }

        public async Task<IEnumerable<ProfileDto>> GetAllProfilesAsync(CancellationToken cancellationToken = default)
        {
            var users = await _userRepository.GetElementsAsync(cancellationToken);
            return _mapper.Map<IEnumerable<ProfileDto>>(users);
        }

        public async Task<ProfileDto> UpdateProfileAsync(int profileId, UpdateProfileDto updateProfileDto, CancellationToken cancellationToken = default)
        {
            var validationResult = await _updateProfileValidator.ValidateAsync(updateProfileDto, cancellationToken);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            var existingUser = await _userRepository.GetItemAsync(profileId, cancellationToken);
            if (existingUser is null)
            {
                throw new NotFoundException($"Profile with ID {profileId} not found.");
            }

            var user = _mapper.Map(updateProfileDto, existingUser);
            await _userRepository.UpdateAsync(profileId, user, cancellationToken);

            var updatedUser = await _userRepository.GetItemAsync(profileId, cancellationToken);

            if (updatedUser is null)
            {
                throw new NotFoundException($"Profile with ID {profileId} not found.");
            }

            await _notificationService.CreateNotificationForUserAsync(new CreateNotificationDto
            {
                Message = "Your profile has been successfully updated",
                Title = "Profile update",
                UserId = profileId
            });

            return _mapper.Map<ProfileDto>(updatedUser);
        }

        public async Task DeleteProfileAsync(int profileId, CancellationToken cancellationToken = default)
        {
            var existingUser = await _userRepository.GetItemAsync(profileId, cancellationToken);
            if (existingUser is null)
            {
                throw new NotFoundException($"Profile with ID {profileId} not found.");
            }
            _cache.Remove($"User_{existingUser.Email}");
            await _userRepository.DeleteAsync(profileId, cancellationToken);
        }
    }
}
