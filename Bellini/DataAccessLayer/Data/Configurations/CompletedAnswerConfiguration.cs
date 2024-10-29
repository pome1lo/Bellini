using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccessLayer.Data.Configurations
{
    public class CompletedAnswerConfiguration : IEntityTypeConfiguration<CompletedAnswer>
    {
        public void Configure(EntityTypeBuilder<CompletedAnswer> builder)
        {
            // Настройка связи с Game
            builder.HasOne(ca => ca.Game)
                .WithMany(g => g.CompletedAnswers)
                .HasForeignKey(ca => ca.GameId)
                .OnDelete(DeleteBehavior.NoAction);

            // Настройка связи с Player (без свойства CompletedAnswers в Player)
            builder.HasOne(ca => ca.Player)
                .WithMany() // Убираем навигационное свойство
                .HasForeignKey(ca => ca.PlayerId)
                .OnDelete(DeleteBehavior.NoAction);

            // Настройка связи с Question (без свойства CompletedAnswers в Question)
            builder.HasOne(ca => ca.Question)
                .WithMany() // Убираем навигационное свойство
                .HasForeignKey(ca => ca.QuestionId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
