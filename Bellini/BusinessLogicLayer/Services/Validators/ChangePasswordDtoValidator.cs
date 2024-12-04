using DataAccessLayer.Services.DTOs;
using FluentValidation;

namespace DataAccessLayer.Services.Validators
{
    public class ChangePasswordDtoValidator : AbstractValidator<ChangePasswordDto>
    {
        public ChangePasswordDtoValidator()
        {
            RuleFor(x => x.UserId).NotEmpty().WithMessage("UserId cannot be empty.");

            RuleFor(x => x.CurrentPassword).NotEmpty().WithMessage("Current password cannot be empty.");
            RuleFor(x => x.CurrentPassword).Length(8, 60).WithMessage("Current password length must be > 8 and < 60");

            RuleFor(x => x.NewPassword).NotEmpty().WithMessage("New password cannot be empty.");
            RuleFor(x => x.NewPassword).Length(8, 60).WithMessage("New password length must be > 8 and < 60");
        }
    }
}
