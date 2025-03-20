using BusinessLogicLayer.Services.DTOs;
using FluentValidation;

namespace BusinessLogicLayer.Services.Validators
{
    public class AdminUpdateUserDtoValidator : AbstractValidator<AdminUpdateUserDto>
    {
        public AdminUpdateUserDtoValidator()
        {
            RuleFor(x => x.FirstName)
                .Length(1, 50).WithMessage("First name must be between 1 and 50 characters.")
                .When(x => !string.IsNullOrEmpty(x.FirstName));

            RuleFor(x => x.LastName)
                .Length(1, 50).WithMessage("Last name must be between 1 and 50 characters.")
                .When(x => !string.IsNullOrEmpty(x.LastName));

            //RuleFor(x => x.ProfileImageUrl)
            //    .Must(uri => Uri.IsWellFormedUriString(uri, UriKind.Absolute)).WithMessage("Profile image URL is not valid.")
            //    .When(x => !string.IsNullOrEmpty(x.ProfileImageUrl));

            RuleFor(x => x)
                .Must(x => !string.IsNullOrEmpty(x.FirstName)
                        || !string.IsNullOrEmpty(x.LastName)
                        || !string.IsNullOrEmpty(x.ProfileImageUrl))
                .WithMessage("At least one field must be provided for the update.");
        }
    }
}
