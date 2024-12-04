using BusinessLogicLayer.Services.DTOs;
using FluentValidation;

namespace BusinessLogicLayer.Services.Validators
{
    public class ResetPasswordDtoValidator : AbstractValidator<ResetPasswordDto>
    {
        public ResetPasswordDtoValidator()
        {
            RuleFor(x => x.UserId).NotEmpty().WithMessage("UserId cannot be empty.");

            RuleFor(x => x.NewPassword).NotEmpty().WithMessage("New password cannot be empty.");
            RuleFor(x => x.NewPassword).Length(8, 60).WithMessage("New password length must be > 8 and < 60");

            RuleFor(x => x.VerificationCode).NotEmpty().WithMessage("Verification code cannot be empty.");
        }
    }
}
