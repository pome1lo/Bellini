using System.Xml.Linq;

namespace BusinessLogicLayer.Services.DTOs
{
    public class AdminUpdateUserDto
    {
        public int Id { get; set; }
        public string? Email { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; } 
        public bool IsAdmin { get; set; } = false;
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? ProfileImageUrl { get; set; }
    }
}
