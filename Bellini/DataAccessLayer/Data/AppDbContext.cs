using DataAccessLayer.Data.Configurations;
using DataAccessLayer.Data.Seeds;
using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        /*
            Update-Database -TargetMigration LocalInit
            Update-Database -TargetMigration DockerInit
        */

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var isDocker = Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true";

            var connectionString =
            //  Migration
            //"Server=localhost,1434;Database=BELLINI;User Id=sa;Password=StrongPassword123!;TrustServerCertificate=true;"

            //  Dokcer
            "Server=sqlserver;Database=BELLINI;User Id=sa;Password=StrongPassword123!;TrustServerCertificate=true;"

            //  Local
            //  "Server=localhost;Database=BELLINI;User Id=sa;Password=sa;TrustServerCertificate=true;";
            ;

            optionsBuilder.UseSqlServer(connectionString);
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Game> Games { get; set; } = null!;
        public DbSet<Player> Players { get; set; } = null!;
        public DbSet<GameStatus> GameStatuses { get; set; } = null!;
        public DbSet<Question> Questions { get; set; } = null!;
        public DbSet<AnswerOption> AnswerOptions { get; set; } = null!;

        public DbSet<GameComment> GameComments { get; set; } = null!;
        public DbSet<QuizComment> QuizComments { get; set; } = null!;


        public DbSet<Notification> Notifications { get; set; } = null!;

        public DbSet<Quiz> Quizzes { get; set; } = null!;
        public DbSet<QuizQuestion> QuizQuestions { get; set; } = null!;
        public DbSet<QuizAnswerOption> QuizAnswerOptions { get; set; } = null!;

        public DbSet<QuizResults> QuizResults { get; set; } = null!;
        public DbSet<GameResults> GameResults { get; set; } = null!;



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new UserConfiguration());
            modelBuilder.ApplyConfiguration(new GameConfiguration());
            modelBuilder.ApplyConfiguration(new PlayerConfiguration());
            modelBuilder.ApplyConfiguration(new GameStatusConfiguration());
            modelBuilder.ApplyConfiguration(new QuestionConfiguration());
            modelBuilder.ApplyConfiguration(new AnswerOptionConfiguration());

            modelBuilder.ApplyConfiguration(new GameCommentConfiguration());
            modelBuilder.ApplyConfiguration(new QuizCommentConfiguration());

            modelBuilder.ApplyConfiguration(new NotificationConfiguration());

            modelBuilder.ApplyConfiguration(new QuizConfiguration());
            modelBuilder.ApplyConfiguration(new QuizAnswerOptionConfiguration());
            modelBuilder.ApplyConfiguration(new QuizQuestionConfiguration());
            modelBuilder.ApplyConfiguration(new QuizResultsConfiguration());

            QuizSeedData.Seed(modelBuilder);

            base.OnModelCreating(modelBuilder);
        }


    }
}
