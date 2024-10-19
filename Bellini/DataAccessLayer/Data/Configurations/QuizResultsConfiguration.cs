using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccessLayer.Data.Configurations
{
    public class QuizResultsConfiguration : IEntityTypeConfiguration<QuizResults>
    {
        public void Configure(EntityTypeBuilder<QuizResults> builder)
        {
            builder.ToTable("QuizResults");

            builder.HasKey(qr => qr.Id);

            builder.Property(qr => qr.NumberOfCorrectAnswers)
                   .IsRequired();

            builder.Property(qr => qr.NumberOfQuestions)
                   .IsRequired();

            builder.HasOne(qr => qr.User)
                   .WithMany(u => u.QuizResults)
                   .HasForeignKey(qr => qr.UserId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(qr => qr.Quiz)
                   .WithMany(q => q.QuizResults)
                   .HasForeignKey(qr => qr.QuizId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
