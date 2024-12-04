using BusinessLogicLayer.Services.DTOs;
using FluentValidation;

namespace BusinessLogicLayer.Services.Validators
{
    public class ProfileDtoValidator : AbstractValidator<ProfileDto>
    {
        public ProfileDtoValidator()
        {
            RuleFor(x => x.Username)
                .NotEmpty().WithMessage("Username cannot be empty.")
                .Length(3, 20).WithMessage("Username must be between 3 and 20 characters.")
                .Matches("^[a-zA-Z0-9]+$").WithMessage("Username can contain only letters and numbers.");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email cannot be empty.")
                .EmailAddress(FluentValidation.Validators.EmailValidationMode.AspNetCoreCompatible).WithMessage("Email is not valid.");

            RuleFor(x => x.FirstName)
                .NotEmpty().WithMessage("First name cannot be empty.")
                .Length(1, 50).WithMessage("First name must be between 1 and 50 characters.");

            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("Last name cannot be empty.")
                .Length(1, 50).WithMessage("Last name must be between 1 and 50 characters.");

            RuleFor(x => x.DateOfBirth)
                .NotEmpty().WithMessage("Date of birth cannot be empty.")
                .LessThan(DateTime.Now).WithMessage("Date of birth must be in the past.");

            RuleFor(x => x.ProfileImageUrl)
                .Must(uri => Uri.IsWellFormedUriString(uri, UriKind.Absolute)).WithMessage("Profile image URL is not valid.")
                .When(x => !string.IsNullOrEmpty(x.ProfileImageUrl));
        }
    }
}
