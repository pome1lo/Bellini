namespace BusinessLogicLayer.Services.Interfaces
{
    public interface IPasswordService
    {
        Task ChangePasswordAsync(string userId, string currentPassword, string newPassword, CancellationToken cancellationToken = default);
        Task ResetPasswordAsync(string userId, string newPassword, CancellationToken cancellationToken = default);
        Task ForgotPasswordAsync(string email, CancellationToken cancellationToken = default);
    }

}
