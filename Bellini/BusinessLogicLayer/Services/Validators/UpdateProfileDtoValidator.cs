using BusinessLogicLayer.Services.DTOs;
using FluentValidation;

namespace BusinessLogicLayer.Services.Validators
{
    public class UpdateProfileDtoValidator : AbstractValidator<UpdateProfileDto>
    {
        public UpdateProfileDtoValidator()
        {
            RuleFor(x => x.Username)
                .Length(3, 20).WithMessage("Username must be between 3 and 20 characters.")
                .Matches("^[a-zA-Z0-9]+$").WithMessage("Username can contain only letters and numbers.")
                .When(x => !string.IsNullOrEmpty(x.Username));

            RuleFor(x => x.Email)
                .EmailAddress(FluentValidation.Validators.EmailValidationMode.AspNetCoreCompatible).WithMessage("Email is not valid.")
                .When(x => !string.IsNullOrEmpty(x.Email));

            RuleFor(x => x.FirstName)
                .Length(1, 50).WithMessage("First name must be between 1 and 50 characters.")
                .When(x => !string.IsNullOrEmpty(x.FirstName));

            RuleFor(x => x.LastName)
                .Length(1, 50).WithMessage("Last name must be between 1 and 50 characters.")
                .When(x => !string.IsNullOrEmpty(x.LastName));

            RuleFor(x => x.DateOfBirth)
                .LessThan(DateTime.Now).WithMessage("Date of birth must be in the past.")
                .When(x => x.DateOfBirth.HasValue);

            RuleFor(x => x.ProfileImageUrl)
                .Must(uri => Uri.IsWellFormedUriString(uri, UriKind.Absolute)).WithMessage("Profile image URL is not valid.")
                .When(x => !string.IsNullOrEmpty(x.ProfileImageUrl));
        }
    }
}
