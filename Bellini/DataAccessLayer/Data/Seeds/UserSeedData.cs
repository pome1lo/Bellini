using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Data.Seeds
{
    internal class UserSeedData
    {
        public static void Seed(ModelBuilder modelBuilder)
        {
            var host =
            //    "/apigateway"
                "https://localhost:7292"
            ;

            var admin = new User()
            {
                Id = 1,
                Email = "paaworker@gmail.com",
                FirstName = "Main",
                LastName = "Admin",
                IsAdmin = true,
                IsActive = true,
                Password = BCrypt.Net.BCrypt.HashPassword("password"),
                IsEmailVerified = true,
                Username = "administrator",
                ProfileImageUrl = $"{host}/covers/1.jpg",
            };

            modelBuilder.Entity<User>().HasData(admin);
        }
    }
}
