using BusinessLogicLayer.Services.DTOs;

namespace BusinessLogicLayer.Services.Interfaces
{
    public interface IPasswordService
    {
        Task ChangePasswordAsync(ChangePasswordDto changePasswordDto, CancellationToken cancellationToken = default);
        Task ResetPasswordAsync(ResetPasswordDto resetPasswordDto, CancellationToken cancellationToken = default);
        Task ForgotPasswordAsync(string email, CancellationToken cancellationToken = default);
    } 
}
