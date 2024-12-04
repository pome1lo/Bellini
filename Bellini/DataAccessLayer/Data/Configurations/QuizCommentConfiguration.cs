using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccessLayer.Data.Configurations
{
    public class QuizCommentConfiguration : IEntityTypeConfiguration<QuizComment>
    {
        public void Configure(EntityTypeBuilder<QuizComment> builder)
        {
            builder.ToTable("QuizComments");

            builder.HasKey(c => c.Id);

            builder.Property(c => c.Content)
                   .IsRequired()
                   .HasMaxLength(500);

            builder.HasOne(c => c.Quiz)
                   .WithMany(g => g.Comments)
                   .HasForeignKey(c => c.QuizId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
