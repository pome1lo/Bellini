namespace BusinessLogicLayer.Services.DTOs
{
    public class AdminCreateUserDto
    {
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
        public bool IsAdmin { get; set; } = false;
    }
}
