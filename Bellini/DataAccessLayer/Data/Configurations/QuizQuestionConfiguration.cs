using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccessLayer.Data.Configurations
{
    public class QuizQuestionConfiguration : IEntityTypeConfiguration<QuizQuestion>
    {
        public void Configure(EntityTypeBuilder<QuizQuestion> builder)
        {
            builder.ToTable("QuizQuestions");

            builder.HasKey(qq => qq.Id);

            builder.Property(qq => qq.Text)
                   .IsRequired()
                   .HasMaxLength(500);

            builder.HasOne(qq => qq.Quiz)
                   .WithMany(q => q.Questions)
                   .HasForeignKey(qq => qq.QuizId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(qq => qq.AnswerOptions)
                   .WithOne(ao => ao.QuizQuestion)
                   .HasForeignKey(ao => ao.QuizQuestionId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
