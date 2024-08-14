using AutoMapper;
using BusinessLogic.Exceptions;
using BusinessLogic.Services.Interfaces;
using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using DataAccess.Data.Interfaces;
using DataAccess.Data.Repositories;
using DataAccess.Models;

namespace BusinessLogicLayer.Services
{
    public class PasswordService : IPasswordService
    {

        private readonly INotificationService _emailService;
        private readonly IRepository<User> _repository; 

        public PasswordService(INotificationService emailService, IRepository<User> repository)
        {
            _emailService = emailService;
            _repository = repository;
        }

        public async Task ChangePasswordAsync(ChangePasswordDto changePasswordDto, CancellationToken cancellationToken = default)
        {
            var user = await _repository.GetItemAsync(changePasswordDto.UserId, cancellationToken);
            if (user == null)
            {
                throw new NotFoundException("User not found.");
            }

            if (!BCrypt.Net.BCrypt.Verify(changePasswordDto.CurrentPassword, user.Password))
            {
                throw new UnauthorizedAccessException("Invalid current password.");
            }

            user.Password = BCrypt.Net.BCrypt.HashPassword(changePasswordDto.NewPassword);
            await _repository.UpdateAsync(user.Id, user, cancellationToken);
        }

        public Task ForgotPasswordAsync(string email, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public Task ResetPasswordAsync(string userId, string newPassword, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }
    }
}
