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
                Password = "$2a$11$9Y6i/HQgs1KnlFg6L29sI.SB3/HMIJ.zbZGrBg.8F9xTF6iHQblv6", // password
                IsEmailVerified = true,
                Username = "administrator",
                ProfileImageUrl = $"{host}/covers/1.jpg"
            };

            var statistics = new UserStatistics()
            {
                Id = 1,
                UserId = 1,
            };

            modelBuilder.Entity<UserStatistics>().HasData();
            modelBuilder.Entity<User>().HasData(admin);
        }
    }
}
