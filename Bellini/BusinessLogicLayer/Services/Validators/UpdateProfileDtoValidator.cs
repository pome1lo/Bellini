using DataAccessLayer.Services.DTOs;
using FluentValidation;

namespace DataAccessLayer.Services.Validators
{
    public class UpdateProfileDtoValidator : AbstractValidator<UpdateProfileDto>
    {
        public UpdateProfileDtoValidator()
        {
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

            RuleFor(x => x)
                .Must(x => !string.IsNullOrEmpty(x.FirstName)
                        || !string.IsNullOrEmpty(x.LastName)
                        || x.DateOfBirth.HasValue
                        || !string.IsNullOrEmpty(x.ProfileImageUrl))
                .WithMessage("At least one field must be provided for the update.");
        }
    }
}
