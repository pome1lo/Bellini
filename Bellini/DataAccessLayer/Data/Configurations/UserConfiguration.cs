using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccessLayer.Data.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            // Настройка имени таблицы
            builder.ToTable("Users");

            // Настройка первичного ключа
            builder.HasKey(e => e.Id);

            // Настройка свойств
            builder.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(e => e.Username)
                .HasMaxLength(50);

            builder.Property(e => e.Password)
                .HasMaxLength(100);

            builder.Property(e => e.FirstName)
                .HasMaxLength(50);

            builder.Property(e => e.LastName)
                .HasMaxLength(50);

            builder.Property(e => e.ProfileImageUrl)
                .HasMaxLength(255);

            // Настройка отношений
            builder.HasMany(u => u.QuizResults)
                .WithOne(q => q.User)
                .HasForeignKey(q => q.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(u => u.GameResults)
                .WithOne(g => g.User)
                .HasForeignKey(g => g.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(u => u.Notifications)
                .WithOne()
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
