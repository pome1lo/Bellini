using DataAccessLayer.Services.DTOs;
using FluentValidation;

namespace DataAccessLayer.Services.Validators
{
    public class GameDtoValidator : AbstractValidator<GameDto>
    {
        public GameDtoValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0).WithMessage("Game ID must be a positive number.");

            RuleFor(x => x.GameName).NotEmpty().WithMessage("Game name cannot be empty.");
            RuleFor(x => x.GameName).Length(3, 100).WithMessage("Game name must be between 3 and 100 characters.");

            RuleFor(x => x.HostId).GreaterThan(0).WithMessage("HostId must be a positive number.");

            RuleFor(x => x.StartTime).NotEmpty().WithMessage("Start time cannot be empty.");

            RuleFor(x => x.MaxPlayers).InclusiveBetween(2, 100).WithMessage("Max players must be between 2 and 100.");
        }
    }
}
