using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccessLayer.Data.Configurations
{
    public class GameStatusConfiguration : IEntityTypeConfiguration<GameStatus>
    {
        public void Configure(EntityTypeBuilder<GameStatus> builder)
        {
            builder.ToTable("GameStatuses");

            builder.HasKey(gs => gs.Id);

            builder.Property(gs => gs.Name)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.HasData(
                new GameStatus { Name = "Not started" },
                new GameStatus { Name = "In process" },
                new GameStatus { Name = "Completed" }
            );

            builder.HasMany(gs => gs.Games)
                   .WithOne(g => g.Status)
                   .HasForeignKey(g => g.GameStatusId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
