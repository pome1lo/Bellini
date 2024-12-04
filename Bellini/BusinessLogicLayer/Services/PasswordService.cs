using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Models;
using FluentValidation;
using DataAccessLayer.Services.DTOs;
using DataAccessLayer.Services.Interfaces;
using DataAccessLayer.Utils;
using UtilsModelsLibrary.Exceptions;

namespace DataAccessLayer.Services
{
    public class PasswordService : IPasswordService
    {
        private readonly INotificationService _emailService;
        private readonly IRepository<User> _repository;
        private readonly IValidator<ChangePasswordDto> _changePasswordValidator;
        private readonly IValidator<ForgotPasswordDto> _forgotPasswordValidator;
        private readonly IValidator<ResetPasswordDto> _resetPasswordValidator;
        private readonly ICacheService _cacheService;

        public PasswordService(
            INotificationService emailService,
            IRepository<User> repository,
            IValidator<ChangePasswordDto> changePasswordValidator,
            IValidator<ForgotPasswordDto> forgotPasswordValidator,
            IValidator<ResetPasswordDto> resetPasswordValidator,
            ICacheService cacheService)
        {
            _emailService = emailService;
            _repository = repository;
            _changePasswordValidator = changePasswordValidator;
            _forgotPasswordValidator = forgotPasswordValidator;
            _resetPasswordValidator = resetPasswordValidator;
            _cacheService = cacheService;
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

        public async Task<int> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto, CancellationToken cancellationToken = default)
        {
            var validationResult = await _forgotPasswordValidator.ValidateAsync(forgotPasswordDto, cancellationToken);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            var user = (await _repository.GetElementsAsync(cancellationToken)).FirstOrDefault(u => u.Email == forgotPasswordDto.Email);
            if (user is null)
            {
                throw new NotFoundException("User not found.");
            }

            var verificationCode = VerificationCodeGenerator.GenerateVerificationCode();
            var expiry = TimeSpan.FromMinutes(15);

            // Сохраняем код подтверждения во временном хранилище Redis
            await _cacheService.SetAsync(forgotPasswordDto.Email, new VerificationCodeDataDto { Code = verificationCode }, expiry);

            var notificationDto = new BaseEmailNotificationDto
            {
                Email = user.Email,
                Subject = "Password Reset Verification Code",
                Body = $"Your verification code is {verificationCode}"
            };
            await _emailService.SendEmailNotificationAsync(notificationDto, cancellationToken);
            return user.Id;
        }

        public async Task<string> VerifyCodeAsync(VerifyCodeDto verifyCodeDto, CancellationToken cancellationToken = default)
        {
            var cachedData = await _cacheService.GetAsync<VerificationCodeDataDto>(verifyCodeDto.Email);
            if (cachedData == null || cachedData.Code != verifyCodeDto.VerificationCode)
            {
                throw new UnauthorizedAccessException("Invalid or expired verification code.");
            }
            return verifyCodeDto.VerificationCode;
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

            var cachedData = await _cacheService.GetAsync<VerificationCodeDataDto>(resetPasswordDto.Email);
            if (cachedData == null || cachedData.Code != resetPasswordDto.VerificationCode)
            {
                throw new ValidationException("Invalid or expired verification code.");
            }

            user.Password = BCrypt.Net.BCrypt.HashPassword(resetPasswordDto.NewPassword);
            await _repository.UpdateAsync(user.Id, user, cancellationToken);

            // Удаляем временные данные из Redis
            await _cacheService.RemoveAsync(resetPasswordDto.Email);
        }
    }
}
