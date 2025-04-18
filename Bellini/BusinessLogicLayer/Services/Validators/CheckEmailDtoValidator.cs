﻿using BusinessLogicLayer.Services.DTOs;
using FluentValidation;
using FluentValidation.Validators;

namespace BusinessLogicLayer.Services.Validators
{
    public class CheckEmailDtoValidator : AbstractValidator<CheckEmailDto>
    {
        public CheckEmailDtoValidator()
        {
            RuleFor(x => x.Email).NotEmpty().WithMessage("Email cannot be empty.");
            RuleFor(x => x.Email).EmailAddress(EmailValidationMode.AspNetCoreCompatible).WithMessage("Email is not valid");
        }
    }
}
