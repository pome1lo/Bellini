using BusinessLogicLayer.Services.DTOs;
using FluentValidation;

namespace BusinessLogicLayer.Services.Validators
{
    public class PlayerDtoValidator : AbstractValidator<PlayerDto>
    {
        public PlayerDtoValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0).WithMessage("Player ID must be a positive number.");

            //RuleFor(x => x.Name).NotEmpty().WithMessage("Player name cannot be empty.");
            //RuleFor(x => x.Name).Length(3, 50).WithMessage("Player name must be between 3 and 50 characters.");

            RuleFor(x => x.GameId).GreaterThan(0).WithMessage("Game ID must be a positive number.");
        }
    }

}
