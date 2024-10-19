using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccessLayer.Data.Configurations
{
    public class QuizAnswerOptionConfiguration : IEntityTypeConfiguration<QuizAnswerOption>
    {
        public void Configure(EntityTypeBuilder<QuizAnswerOption> builder)
        {
            builder.ToTable("QuizAnswerOptions");

            builder.HasKey(ao => ao.Id);

            builder.Property(ao => ao.Text)
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(ao => ao.IsCorrect)
                   .IsRequired();

            builder.HasOne(ao => ao.QuizQuestion)
                   .WithMany(qq => qq.AnswerOptions)
                   .HasForeignKey(ao => ao.QuizQuestionId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
