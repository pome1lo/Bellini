using DataAccessLayer.Services.DTOs;
using FluentValidation;

namespace DataAccessLayer.Services.Validators
{
    public class UpdateGameDtoValidator : AbstractValidator<UpdateGameDto>
    {
        public UpdateGameDtoValidator()
        {
            RuleFor(x => x.GameName).NotEmpty().WithMessage("Game name cannot be empty.");
            RuleFor(x => x.GameName).Length(3, 100).WithMessage("Game name must be between 3 and 100 characters.");

            RuleFor(x => x.MaxPlayers).InclusiveBetween(2, 100).WithMessage("Max players must be between 2 and 100.");

            RuleFor(x => x.DifficultyLevel).NotEmpty().WithMessage("Difficulty level cannot be empty.");

            RuleFor(x => x.IsActive).NotNull().WithMessage("IsActive must be set.");
        }
    }

}
