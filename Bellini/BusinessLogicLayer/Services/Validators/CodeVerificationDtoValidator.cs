using DataAccessLayer.Services.DTOs;
using FluentValidation;
using FluentValidation.Validators;

namespace DataAccessLayer.Services.Validators
{
    public class CodeVerificationDtoValidator : AbstractValidator<CodeVerificationDto>
    {
        public CodeVerificationDtoValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email cannot be empty.")
                .EmailAddress(EmailValidationMode.AspNetCoreCompatible).WithMessage("Email is not valid");

            RuleFor(x => x.RegistrationCode)
                .NotEmpty().WithMessage("Registration code cannot be empty.")
                .Length(6).WithMessage("Registration code must be 6 characters long");
        }
    }
}
