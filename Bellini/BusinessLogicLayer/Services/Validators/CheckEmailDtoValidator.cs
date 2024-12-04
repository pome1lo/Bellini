using DataAccessLayer.Services.DTOs;
using FluentValidation.Validators;
using FluentValidation;

namespace DataAccessLayer.Services.Validators
{
    public class CheckEmailDtoValidator : AbstractValidator<CheckEmailDto>
    {
        public CheckEmailDtoValidator()
        {
            RuleFor(x => x.Email).NotEmpty().WithMessage("Email cannot be empty.");
            RuleFor(x => x.Email).EmailAddress(EmailValidationMode.AspNetCoreCompatible).WithMessage("Email is not valid");
        }
    }
}
