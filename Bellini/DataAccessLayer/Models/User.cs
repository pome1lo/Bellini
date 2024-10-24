﻿using DataAccessLayer.Models;

namespace DataAccess.Models
{
    public class User : BaseModel
    {
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? RegistrationCode { get; set; } = string.Empty;
        public string? VerificationCode { get; set; } = string.Empty;
        public DateTime? VerificationCodeExpiry { get; set; }
        public string? FirstName { get; set; } = null!;
        public string? LastName { get; set; } = null!;
        public DateTime? DateOfBirth { get; set; }
        public string? ProfileImageUrl { get; set; }
        public List<QuizResults> QuizResults { get; set; } = null!;
    }
}
