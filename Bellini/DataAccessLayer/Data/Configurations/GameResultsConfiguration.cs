using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccessLayer.Data.Configurations
{
    public class GameResultsConfiguration : IEntityTypeConfiguration<GameResults>
    {
        public void Configure(EntityTypeBuilder<GameResults> builder)
        {
            builder.ToTable("GameResults");

            builder.HasKey(qr => qr.Id);

            builder.Property(qr => qr.NumberOfCorrectAnswers)
                   .IsRequired();

            builder.Property(qr => qr.NumberOfQuestions)
                   .IsRequired();

            builder.HasOne(qr => qr.User)
                   .WithMany(u => u.GameResults)
                   .HasForeignKey(qr => qr.UserId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(qr => qr.Game)
                   .WithMany(q => q.GameResults)
                   .HasForeignKey(qr => qr.GameId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
