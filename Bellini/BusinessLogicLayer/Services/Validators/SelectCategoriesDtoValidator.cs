using BusinessLogicLayer.Services.DTOs;
using FluentValidation;

namespace BusinessLogicLayer.Services.Validators
{
    public class SelectCategoriesDtoValidator : AbstractValidator<SelectCategoriesDto>
    {
        public SelectCategoriesDtoValidator()
        {
            RuleFor(x => x.CategoryIds).NotEmpty().WithMessage("At least one category must be selected.");

            RuleForEach(x => x.CategoryIds).GreaterThan(0).WithMessage("Category ID must be a positive number.");

            RuleFor(x => x.DifficultyLevel).NotEmpty().WithMessage("Difficulty level cannot be empty.");
        }
    }

}
