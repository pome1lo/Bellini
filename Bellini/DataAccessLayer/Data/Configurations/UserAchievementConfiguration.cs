using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccessLayer.Data.Configurations
{
    public class UserAchievementConfiguration : IEntityTypeConfiguration<UserAchievement>
    {
        public void Configure(EntityTypeBuilder<UserAchievement> builder)
        {
            builder.ToTable("UserAchievements");

            builder.HasKey(ua => ua.Id);

            builder.Property(ua => ua.Achievement)
                   .IsRequired();

            builder.Property(ua => ua.AchievedAt)
                   .IsRequired();

            builder.HasOne(ua => ua.User)
                   .WithMany(u => u.Achievements)
                   .HasForeignKey(ua => ua.UserId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
