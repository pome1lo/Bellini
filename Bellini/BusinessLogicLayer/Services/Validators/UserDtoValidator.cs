using DataAccessLayer.Services.DTOs;
using FluentValidation;
using FluentValidation.Validators;

namespace DataAccessLayer.Services.Validators
{
    public class UserDtoValidator : AbstractValidator<UserDto>
    {
        public UserDtoValidator()
        {
            RuleFor(x => x.Username).NotEmpty().WithMessage("Username cannot be empty.");
            RuleFor(x => x.Username).Length(3, 20).WithMessage("Username can be only from 3 to 20 letters or numbers");
            RuleFor(x => x.Username).Matches("^[a-zA-Z0-9]+$").WithMessage("Username can contain only letters or numbers");

            RuleFor(x => x.Email).NotEmpty().WithMessage("Email cannot be empty.");
            RuleFor(x => x.Email).EmailAddress(EmailValidationMode.AspNetCoreCompatible).WithMessage("Email is not valid");

            RuleFor(x => x.Password).NotEmpty().WithMessage("Password cannot be empty.");
            RuleFor(x => x.Password).Length(8, 60).WithMessage("Password length must be > 8 and < 60");
        }
    }
}
