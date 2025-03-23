namespace BusinessLogicLayer.Services.DTOs
{
    public class CreateInviteNotificationDto
    {
        public int FromUserId { get; set; } 
        public int ToUserId { get; set; }
        public string Email { get; set; } = null!;
        public string GameName { get; set; } = null!;
        public string Link { get; set; } = null!;
        public bool IsPrivateRoom { get; set; } = false;
        public string RoomPassword { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public string Title { get; set; } = "You have a new invitation.";
    }
}
