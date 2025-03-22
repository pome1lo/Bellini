using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccessLayer.Data.Configurations
{
    public class QuestionConfiguration : IEntityTypeConfiguration<GameQuestion>
    {
        public void Configure(EntityTypeBuilder<GameQuestion> builder)
        {
            builder.ToTable("Questions");

            builder.HasKey(q => q.Id);

            builder.Property(q => q.Text)
                   .IsRequired()
                   .HasMaxLength(500);

            builder.Property(q => q.IsCustom)
                   .IsRequired();

            builder.HasOne(q => q.Game)
                   .WithMany(g => g.Questions)
                   .HasForeignKey(q => q.GameId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(q => q.AnswerOptions)
                   .WithOne(a => a.GameQuestion)
                   .HasForeignKey(a => a.QuestionId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
