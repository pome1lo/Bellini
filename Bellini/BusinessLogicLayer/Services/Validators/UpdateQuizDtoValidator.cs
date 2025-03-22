using BusinessLogicLayer.Services.DTOs;
using FluentValidation;

namespace BusinessLogicLayer.Services.Validators
{
    public class UpdateQuizDtoValidator : AbstractValidator<UpdateQuizDto>
    {
        public UpdateQuizDtoValidator()
        {
            RuleFor(x => x.GameName)
                .NotEmpty().WithMessage("GameName cannot be empty.")
                .Length(3, 20).WithMessage("GameName must be between 3 and 20 characters.")
                .Matches("^[a-zA-Z0-9]+$").WithMessage("GameName can contain only letters and numbers.");


            //RuleFor(x => x.GameCoverImageUrl)
            //    .Must(uri => Uri.IsWellFormedUriString(uri, UriKind.Absolute)).WithMessage("GameName image URL is not valid.")
            //    .When(x => !string.IsNullOrEmpty(x.GameCoverImageUrl));
        }
    }
}
