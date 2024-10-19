using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccessLayer.Data.Configurations
{
    public class QuizConfiguration : IEntityTypeConfiguration<Quiz>
    {
        public void Configure(EntityTypeBuilder<Quiz> builder)
        {
            builder.ToTable("Quizzes");

            builder.HasKey(q => q.Id);

            builder.Property(q => q.GameName)
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(q => q.GameCoverImageUrl)
                   .IsRequired()
                   .HasMaxLength(500);

            builder.Property(q => q.StartTime)
                   .IsRequired();

            builder.Property(q => q.EndTime)
                   .IsRequired();

            builder.HasMany(q => q.Questions)
                   .WithOne(qt => qt.Quiz)
                   .HasForeignKey(qt => qt.QuizId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(q => q.QuizResults)
                   .WithOne(qr => qr.Quiz)
                   .HasForeignKey(qr => qr.QuizId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
