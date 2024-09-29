namespace BusinessLogicLayer.Services.DTOs
{
    public class SelectCategoriesDto
    {
        public IEnumerable<string> Categories { get; set; } = null!;
        public string DifficultyLevel { get; set; } = null!;
    }
}
