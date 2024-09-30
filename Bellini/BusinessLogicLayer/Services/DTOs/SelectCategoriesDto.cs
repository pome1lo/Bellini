namespace BusinessLogicLayer.Services.DTOs
{
    public class SelectCategoriesDto
    {
        public List<int> CategoryIds { get; set; } = new List<int>();
        public string DifficultyLevel { get; set; } = null!;
    }
}
