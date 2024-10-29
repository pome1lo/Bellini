using DataAccessLayer.Models;
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

            builder.Property(g => g.IsPrivate)
                   .IsRequired();

            builder.Property(g => g.RoomPassword)
                   .HasMaxLength(50);

            builder.HasOne(g => g.Status)
                   .WithMany(gs => gs.Games)
                   .HasForeignKey(g => g.GameStatusId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(g => g.Players)
                   .WithOne(p => p.Game)
                   .HasForeignKey(p => p.GameId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(g => g.Comments)
                   .WithOne(c => c.Game)
                   .HasForeignKey(c => c.GameId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(g => g.Questions)
                   .WithOne(q => q.Game)
                   .HasForeignKey(q => q.GameId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
