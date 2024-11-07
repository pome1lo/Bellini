using BusinessLogicLayer.Exceptions;
using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using BusinessLogicLayer.Utils;
using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Models;
using FluentValidation;

namespace BusinessLogicLayer.Services
{
    public class PasswordService : IPasswordService
    {
        private readonly INotificationService _emailService;
        private readonly IRepository<User> _repository;
        private readonly IValidator<ChangePasswordDto> _changePasswordValidator;
        private readonly IValidator<ForgotPasswordDto> _forgotPasswordValidator;
        private readonly IValidator<ResetPasswordDto> _resetPasswordValidator;

        public PasswordService(
            INotificationService emailService,
            IRepository<User> repository,
            IValidator<ChangePasswordDto> changePasswordValidator,
            IValidator<ForgotPasswordDto> forgotPasswordValidator,
            IValidator<ResetPasswordDto> resetPasswordValidator)
        {
            _emailService = emailService;
            _repository = repository;
            _changePasswordValidator = changePasswordValidator;
            _forgotPasswordValidator = forgotPasswordValidator;
            _resetPasswordValidator = resetPasswordValidator;
        }

        public async Task ChangePasswordAsync(ChangePasswordDto changePasswordDto, CancellationToken cancellationToken = default)
        {
            var validationResult = await _changePasswordValidator.ValidateAsync(changePasswordDto, cancellationToken);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            var user = await _repository.GetItemAsync(changePasswordDto.UserId, cancellationToken);
            if (user is null)
            {
                throw new NotFoundException("User not found.");
            }

            if (!BCrypt.Net.BCrypt.Verify(changePasswordDto.CurrentPassword, user.Password))
            {
                throw new ValidationException("Invalid current password.");
            }

            user.Password = BCrypt.Net.BCrypt.HashPassword(changePasswordDto.NewPassword);
            await _repository.UpdateAsync(user.Id, user, cancellationToken);
        }

        public async Task ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto, CancellationToken cancellationToken = default)
        {
            var validationResult = await _forgotPasswordValidator.ValidateAsync(forgotPasswordDto, cancellationToken);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            var users = await _repository.GetElementsAsync(cancellationToken);
            var user = users.FirstOrDefault(u => u.Email == forgotPasswordDto.Email);
            if (user is null)
            {
                throw new NotFoundException("User not found.");
            }

            var verificationCode = VerificationCodeGenerator.GenerateVerificationCode();
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
            if (user is null || user.VerificationCode != verifyCodeDto.VerificationCode || user.VerificationCodeExpiry < DateTime.UtcNow)
            {
                throw new UnauthorizedAccessException("Invalid or expired verification code.");
            }
        }

        public async Task ResetPasswordAsync(ResetPasswordDto resetPasswordDto, CancellationToken cancellationToken = default)
        {
            var validationResult = await _resetPasswordValidator.ValidateAsync(resetPasswordDto, cancellationToken);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            var user = await _repository.GetItemAsync(resetPasswordDto.UserId, cancellationToken);
            if (user is null)
            {
                throw new NotFoundException("User not found.");
            }

            if (user.VerificationCode != resetPasswordDto.VerificationCode || user.VerificationCodeExpiry < DateTime.UtcNow)
            {
                throw new ValidationException("Invalid or expired verification code.");
            }

            user.Password = BCrypt.Net.BCrypt.HashPassword(resetPasswordDto.NewPassword);
            user.VerificationCode = null;
            user.VerificationCodeExpiry = DateTime.MinValue;
            await _repository.UpdateAsync(user.Id, user, cancellationToken);
        }
    }
}
