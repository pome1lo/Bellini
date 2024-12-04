using DataAccessLayer.Services.DTOs;
using FluentValidation;

namespace DataAccessLayer.Services.Validators
{
    public class CommentDtoValidator : AbstractValidator<CommentDto>
    {
        public CommentDtoValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0).WithMessage("Comment ID must be a positive number.");

            RuleFor(x => x.GameId).GreaterThan(0).WithMessage("Game ID must be a positive number.");

            RuleFor(x => x.Content).NotEmpty().WithMessage("Comment content cannot be empty.");
            RuleFor(x => x.Content).Length(1, 500).WithMessage("Comment content must be between 1 and 500 characters.");

            RuleFor(x => x.CreatedBy).GreaterThan(0).WithMessage("CreatedBy must be a positive number.");

            RuleFor(x => x.CreatedAt).NotEmpty().WithMessage("CreatedAt cannot be empty.");
        }
    }
}
