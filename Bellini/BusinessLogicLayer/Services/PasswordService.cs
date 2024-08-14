using BusinessLogic.Exceptions;
using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using DataAccess.Data.Interfaces;
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

        public async Task ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto, CancellationToken cancellationToken = default)
        {
            var users = await _repository.GetElementsAsync(cancellationToken);
            var user = users.FirstOrDefault(u => u.Email == forgotPasswordDto.Email);
            if (user == null)
            {
                throw new NotFoundException("User not found.");
            }

            var verificationCode = GenerateVerificationCode();
            user.VerificationCode = verificationCode;
            user.VerificationCodeExpiry = DateTime.UtcNow.AddMinutes(15);
            await _repository.UpdateAsync(user.Id, user, cancellationToken);

            var notificationDto = new BaseEmailNotificationDto
            {
                Email = user.Email,
                Subject = "Password Reset Verification Code",
                Body = $"Your verification code is {verificationCode}"
            };
            await _emailService.SendEmailNotificationAsync(notificationDto, cancellationToken);
        }

        public async Task VerifyCodeAsync(VerifyCodeDto verifyCodeDto, CancellationToken cancellationToken = default)
        {
            var users = await _repository.GetElementsAsync(cancellationToken);
            var user = users.FirstOrDefault(u => u.Email == verifyCodeDto.Email);
            if (user == null || user.VerificationCode != verifyCodeDto.VerificationCode || user.VerificationCodeExpiry < DateTime.UtcNow)
            {
                throw new UnauthorizedAccessException("Invalid or expired verification code.");
            }
        }

        public async Task ResetPasswordAsync(ResetPasswordDto resetPasswordDto, CancellationToken cancellationToken = default)
        {
            var user = await _repository.GetItemAsync(resetPasswordDto.UserId, cancellationToken);
            if (user == null)
            {
                throw new NotFoundException("User not found.");
            }

            if (user.VerificationCode != resetPasswordDto.VerificationCode || user.VerificationCodeExpiry < DateTime.UtcNow)
            {
                throw new UnauthorizedAccessException("Invalid or expired verification code.");
            }

            user.Password = BCrypt.Net.BCrypt.HashPassword(resetPasswordDto.NewPassword);
            user.VerificationCode = null;
            user.VerificationCodeExpiry = DateTime.MinValue;
            await _repository.UpdateAsync(user.Id, user, cancellationToken);
        }

        private string GenerateVerificationCode()
        {
            return new Random().Next(100000, 999999).ToString();
        }
    }
}
