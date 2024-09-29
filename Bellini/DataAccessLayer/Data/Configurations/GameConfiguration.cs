using DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccessLayer.Data.Configurations
{
    public class GameConfiguration : IEntityTypeConfiguration<Game>
    {
        public void Configure(EntityTypeBuilder<Game> builder)
        {
            builder.ToTable("Games");

            builder.HasKey(g => g.Id);

            builder.Property(g => g.GameName)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(g => g.HostId)
                   .IsRequired();

            builder.Property(g => g.StartTime)
                   .IsRequired();

            builder.Property(g => g.MaxPlayers)
                   .IsRequired();

            builder.Property(g => g.IsActive)
                   .IsRequired();

            builder.Property(g => g.DifficultyLevel)
                   .HasMaxLength(50);

            builder.HasMany(g => g.Categories)
                   .WithMany(c => c.Games)
                   .UsingEntity(j => j.ToTable("GameCategories"));

            builder.HasMany(g => g.Players)
                   .WithOne(p => p.Game)
                   .HasForeignKey(p => p.GameId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(g => g.Comments)
                   .WithOne(c => c.Game)
                   .HasForeignKey(c => c.GameId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
