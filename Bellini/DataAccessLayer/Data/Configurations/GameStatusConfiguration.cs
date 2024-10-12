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

            builder.Property(gs => gs.Id)  // Отключаем автоинкремент
                   .ValueGeneratedNever();

            builder.Property(gs => gs.Name)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.HasData(
                new GameStatus { Id = 1, Name = "Not started" },
                new GameStatus { Id = 2, Name = "In process" },
                new GameStatus { Id = 3, Name = "Completed" }
            );

            builder.HasMany(gs => gs.Games)
                   .WithOne(g => g.Status)
                   .HasForeignKey(g => g.GameStatusId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
