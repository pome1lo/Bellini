﻿using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccessLayer.Data.Configurations
{
    public class AnswerOptionConfiguration : IEntityTypeConfiguration<GameAnswerOption>
    {
        public void Configure(EntityTypeBuilder<GameAnswerOption> builder)
        {
            builder.ToTable("AnswerOptions");

            builder.HasKey(a => a.Id);

            builder.Property(a => a.Text)
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(a => a.IsCorrect)
                   .IsRequired();

            builder.HasOne(a => a.GameQuestion)
                   .WithMany(q => q.AnswerOptions)
                   .HasForeignKey(a => a.QuestionId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
