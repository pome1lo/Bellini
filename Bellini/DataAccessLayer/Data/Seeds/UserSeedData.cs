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

            var password = "$2a$11$9Y6i/HQgs1KnlFg6L29sI.SB3/HMIJ.zbZGrBg.8F9xTF6iHQblv6";

            var users = new List<User>
            {
                new User
                {
                    Id = 1,
                    Email = "paaworker@gmail.com",
                    FirstName = "Main",
                    LastName = "Admin",
                    IsAdmin = true,
                    IsActive = true,
                    Password = password,
                    IsEmailVerified = true,
                    Username = "administrator",
                    ProfileImageUrl = $"{host}/default/1.jpg"
                }
            };

            var firstNames = new[] { "John", "Jane", "Mike", "Emily", "David", "Emma", "Chris", "Sophia", "Daniel", "Olivia" };
            var lastNames = new[] { "Doe", "Smith", "Johnson", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson" };

            for (int i = 0; i < 10; i++)
            {
                users.Add(new User
                {
                    Id = i + 2,
                    Email = $"user{i + 1}@example.com",
                    FirstName = firstNames[i],
                    LastName = lastNames[i],
                    IsAdmin = false,
                    IsActive = true,
                    Password = password,
                    IsEmailVerified = true,
                    Username = $"user{i + 1}",
                    ProfileImageUrl = $"{host}/default/{i + 1}.jpg"
                });
            }

            var statistics = new List<UserStatistics>
            {
                new UserStatistics() {Id = 1, UserId = 1},
                new UserStatistics() {Id = 2, UserId = 2},
                new UserStatistics() {Id = 3, UserId = 3},
                new UserStatistics() {Id = 4, UserId = 4},
                new UserStatistics() {Id = 5, UserId = 5},
                new UserStatistics() {Id = 6, UserId = 6},
                new UserStatistics() {Id = 7, UserId = 7},
                new UserStatistics() {Id = 8, UserId = 8},
                new UserStatistics() {Id = 9, UserId = 9},
                new UserStatistics() {Id = 10, UserId = 10},
                new UserStatistics() {Id = 11, UserId = 11},
            };
  
            modelBuilder.Entity<User>().HasData(users);
            modelBuilder.Entity<UserStatistics>().HasData(statistics);
        }
    }
}
