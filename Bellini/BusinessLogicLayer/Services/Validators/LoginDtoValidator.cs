using BusinessLogicLayer.Services.DTOs;
using FluentValidation;
using FluentValidation.Validators;

namespace BusinessLogicLayer.Services.Validators
{
    public class LoginDtoValidator : AbstractValidator<LoginDto>
    {
        public LoginDtoValidator()
        {
            RuleFor(x => x.Email).NotEmpty().WithMessage("Email cannot be empty.");
            RuleFor(x => x.Email).EmailAddress(EmailValidationMode.AspNetCoreCompatible).WithMessage("Email is not valid");

            RuleFor(x => x.Password).NotEmpty().WithMessage("Password cannot be empty.");
            RuleFor(x => x.Password).Length(8, 60).WithMessage("Password length must be > 8 and < 60");
        }
    }
}
