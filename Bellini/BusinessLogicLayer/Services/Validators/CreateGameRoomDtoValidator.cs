using BusinessLogicLayer.Services.DTOs;
using FluentValidation;

namespace BusinessLogicLayer.Services.Validators
{
    public class CreateGameRoomDtoValidator : AbstractValidator<CreateGameRoomDto>
    {
        public CreateGameRoomDtoValidator()
        {
            RuleFor(x => x.GameName).NotEmpty().WithMessage("Game name cannot be empty.");
            RuleFor(x => x.GameName).Length(3, 100).WithMessage("Game name must be between 3 and 100 characters.");

            RuleFor(x => x.HostId).GreaterThan(0).WithMessage("HostId must be a positive number.");

            RuleFor(x => x.StartTime).GreaterThan(DateTime.Now).WithMessage("Start time must be in the future.");

            RuleFor(x => x.MaxPlayers).InclusiveBetween(2, 100).WithMessage("Max players must be between 2 and 100.");

            RuleFor(x => x.DifficultyLevel).NotEmpty().WithMessage("Difficulty level cannot be empty.");
        }
    }
}
