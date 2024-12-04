using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccessLayer.Data.Configurations
{
    public class GameCommentConfiguration : IEntityTypeConfiguration<GameComment>
    {
        public void Configure(EntityTypeBuilder<GameComment> builder)
        {
            builder.ToTable("GameComments");

            builder.HasKey(c => c.Id);

            builder.Property(c => c.Content)
                   .IsRequired()
                   .HasMaxLength(500);

            builder.HasOne(c => c.Game)
                   .WithMany(g => g.Comments)
                   .HasForeignKey(c => c.GameId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
