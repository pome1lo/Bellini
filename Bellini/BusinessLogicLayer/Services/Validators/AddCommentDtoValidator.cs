using BusinessLogicLayer.Services.DTOs;
using FluentValidation;

namespace BusinessLogicLayer.Services.Validators
{
    public class AddCommentDtoValidator : AbstractValidator<AddCommentDto>
    {
        public AddCommentDtoValidator()
        {
            RuleFor(x => x.Content).NotEmpty().WithMessage("Comment content cannot be empty.");
            RuleFor(x => x.Content).Length(1, 500).WithMessage("Comment content must be between 1 and 500 characters.");

            RuleFor(x => x.CreatedBy).GreaterThan(0).WithMessage("CreatedBy must be a positive number.");

            RuleFor(x => x.CreatedAt).NotEmpty().WithMessage("CreatedAt cannot be empty.");
        }
    }
}
