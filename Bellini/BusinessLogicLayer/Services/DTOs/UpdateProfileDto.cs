namespace BusinessLogicLayer.Services.DTOs
{
    public class UpdateProfileDto
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? ProfileImageUrl { get; set; }
    }
}
