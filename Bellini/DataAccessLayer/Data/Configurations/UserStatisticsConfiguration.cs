using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccessLayer.Data.Configurations
{
    public class UserStatisticsConfiguration : IEntityTypeConfiguration<UserStatistics>
    {
        public void Configure(EntityTypeBuilder<UserStatistics> builder)
        {
            builder.ToTable("UserStatistics");

            builder.HasKey(us => us.Id);

            builder.HasIndex(us => us.UserId)
                   .IsUnique();

            builder.Property(us => us.ProfileEdits)
                   .IsRequired()
                   .HasDefaultValue(0);

            builder.Property(us => us.QuizzesCompleted)
                   .IsRequired()
                   .HasDefaultValue(0);

            builder.HasOne(us => us.User)
                   .WithOne(u => u.Statistics)
                   .HasForeignKey<UserStatistics>(us => us.UserId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
