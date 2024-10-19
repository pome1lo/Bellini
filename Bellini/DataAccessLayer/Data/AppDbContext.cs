using DataAccess.Data.Configurations;
using DataAccess.Models;
using DataAccessLayer.Data.Configurations;
using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Data
{
    public class AppDbContext : DbContext
    {
        //public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        //{
        //}

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Game> Games { get; set; } = null!;
        public DbSet<Player> Players { get; set; } = null!;
        public DbSet<Comment> Comments { get; set; } = null!;
        public DbSet<GameStatus> GameStatuses { get; set; } = null!;
        public DbSet<Question> Questions { get; set; } = null!;
        public DbSet<AnswerOption> AnswerOptions { get; set; } = null!;




        public DbSet<Quiz> Quizzes { get; set; } = null!;
        public DbSet<QuizQuestion> QuizQuestions { get; set; } = null!;
        public DbSet<QuizAnswerOption> QuizAnswerOptions { get; set; } = null!;
        public DbSet<QuizResults> QuizResults { get; set; } = null!;



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new UserConfiguration());
            modelBuilder.ApplyConfiguration(new GameConfiguration());
            modelBuilder.ApplyConfiguration(new PlayerConfiguration());
            modelBuilder.ApplyConfiguration(new CommentConfiguration());
            modelBuilder.ApplyConfiguration(new GameStatusConfiguration());
            modelBuilder.ApplyConfiguration(new QuestionConfiguration());
            modelBuilder.ApplyConfiguration(new AnswerOptionConfiguration());

            modelBuilder.ApplyConfiguration(new QuizConfiguration());
            modelBuilder.ApplyConfiguration(new QuizAnswerOptionConfiguration());
            modelBuilder.ApplyConfiguration(new QuizQuestionConfiguration());
            modelBuilder.ApplyConfiguration(new QuizResultsConfiguration());



            var defaultQuiz = new Quiz
            {
                Id = 1,
                GameName = "Мифология Древней Греции",
                GameCoverImageUrl = "https://i.pinimg.com/originals/b3/7e/4f/b37e4fd167bd9e14558dd14301ec6487.jpg",
                StartTime = DateTime.MinValue,
                EndTime = DateTime.MinValue,
            };

            modelBuilder.Entity<Quiz>().HasData(defaultQuiz);

            var questions = new List<QuizQuestion>
            {
                new QuizQuestion
                {
                    Id = 1,
                    Text = "Кто был верховным богом в греческой мифологии?",
                    QuizId = 1,
                },
                new QuizQuestion
                {
                    Id = 2,
                    Text = "Какой бог был покровителем кузнецов и огня?",
                    QuizId = 1,
                },
                new QuizQuestion
                {
                    Id = 3,
                    Text = "Кто был богом моря?",
                    QuizId = 1,
                },
                new QuizQuestion
                {
                    Id = 4,
                    Text = "Кто был богиней мудрости?",
                    QuizId = 1,
                },
                new QuizQuestion
                {
                    Id = 5,
                    Text = "Кто был богом войны?",
                    QuizId = 1,
                },
                new QuizQuestion
                {
                    Id = 6,
                    Text = "Кто был богиней охоты?",
                    QuizId = 1,
                },
                new QuizQuestion
                {
                    Id = 7,
                    Text = "Кто был вестником богов?",
                    QuizId = 1,
                },
                new QuizQuestion
                {
                    Id = 8,
                    Text = "Кто был богом солнца?",
                    QuizId = 1,
                },
                new QuizQuestion
                {
                    Id = 9,
                    Text = "Кто был богиней любви и красоты?",
                    QuizId = 1,
                },
                new QuizQuestion
                {
                    Id = 10,
                    Text = "Кто был титаном, держащим небо на своих плечах?",
                    QuizId = 1,
                }
            };

            modelBuilder.Entity<QuizQuestion>().HasData(questions);

            var answerOptions = new List<QuizAnswerOption>
            {
                // Вопрос 1
                new QuizAnswerOption { Id = 1, Text = "Посейдон", IsCorrect = false, QuizQuestionId = 1 },
                new QuizAnswerOption { Id = 2, Text = "Геракл", IsCorrect = false, QuizQuestionId = 1 },
                new QuizAnswerOption { Id = 3, Text = "Зевс", IsCorrect = true, QuizQuestionId = 1 },
                new QuizAnswerOption { Id = 4, Text = "Аполлон", IsCorrect = false, QuizQuestionId = 1 },
        
                // Вопрос 2
                new QuizAnswerOption { Id = 5, Text = "Арес", IsCorrect = false, QuizQuestionId = 2 },
                new QuizAnswerOption { Id = 6, Text = "Гефест", IsCorrect = true, QuizQuestionId = 2 },
                new QuizAnswerOption { Id = 7, Text = "Аполлон", IsCorrect = false, QuizQuestionId = 2 },
                new QuizAnswerOption { Id = 8, Text = "Зевс", IsCorrect = false, QuizQuestionId = 2 },

                // Вопрос 3
                new QuizAnswerOption { Id = 9, Text = "Гермес", IsCorrect = false, QuizQuestionId = 3 },
                new QuizAnswerOption { Id = 10, Text = "Посейдон", IsCorrect = true, QuizQuestionId = 3 },
                new QuizAnswerOption { Id = 11, Text = "Дионис", IsCorrect = false, QuizQuestionId = 3 },
                new QuizAnswerOption { Id = 12, Text = "Афина", IsCorrect = false, QuizQuestionId = 3 },

                // Вопрос 4
                new QuizAnswerOption { Id = 13, Text = "Гера", IsCorrect = false, QuizQuestionId = 4 },
                new QuizAnswerOption { Id = 14, Text = "Афина", IsCorrect = true, QuizQuestionId = 4 },
                new QuizAnswerOption { Id = 15, Text = "Артемида", IsCorrect = false, QuizQuestionId = 4 },
                new QuizAnswerOption { Id = 16, Text = "Персефона", IsCorrect = false, QuizQuestionId = 4 },

                // Вопрос 5
                new QuizAnswerOption { Id = 17, Text = "Гермес", IsCorrect = false, QuizQuestionId = 5 },
                new QuizAnswerOption { Id = 18, Text = "Арес", IsCorrect = true, QuizQuestionId = 5 },
                new QuizAnswerOption { Id = 19, Text = "Зевс", IsCorrect = false, QuizQuestionId = 5 },
                new QuizAnswerOption { Id = 20, Text = "Аполлон", IsCorrect = false, QuizQuestionId = 5 },

                // Вопрос 6
                new QuizAnswerOption { Id = 21, Text = "Гера", IsCorrect = false, QuizQuestionId = 6 },
                new QuizAnswerOption { Id = 22, Text = "Артемида", IsCorrect = true, QuizQuestionId = 6 },
                new QuizAnswerOption { Id = 23, Text = "Афродита", IsCorrect = false, QuizQuestionId = 6 },
                new QuizAnswerOption { Id = 24, Text = "Афина", IsCorrect = false, QuizQuestionId = 6 },

                // Вопрос 7
                new QuizAnswerOption { Id = 25, Text = "Гермес", IsCorrect = true, QuizQuestionId = 7 },
                new QuizAnswerOption { Id = 26, Text = "Аполлон", IsCorrect = false, QuizQuestionId = 7 },
                new QuizAnswerOption { Id = 27, Text = "Арес", IsCorrect = false, QuizQuestionId = 7 },
                new QuizAnswerOption { Id = 28, Text = "Дионис", IsCorrect = false, QuizQuestionId = 7 },

                // Вопрос 8
                new QuizAnswerOption { Id = 29, Text = "Арес", IsCorrect = false, QuizQuestionId = 8 },
                new QuizAnswerOption { Id = 30, Text = "Аполлон", IsCorrect = true, QuizQuestionId = 8 },
                new QuizAnswerOption { Id = 31, Text = "Зевс", IsCorrect = false, QuizQuestionId = 8 },
                new QuizAnswerOption { Id = 32, Text = "Гермес", IsCorrect = false, QuizQuestionId = 8 },

                // Вопрос 9
                new QuizAnswerOption { Id = 33, Text = "Афина", IsCorrect = false, QuizQuestionId = 9 },
                new QuizAnswerOption { Id = 34, Text = "Артемида", IsCorrect = false, QuizQuestionId = 9 },
                new QuizAnswerOption { Id = 35, Text = "Афродита", IsCorrect = true, QuizQuestionId = 9 },
                new QuizAnswerOption { Id = 36, Text = "Гера", IsCorrect = false, QuizQuestionId = 9 },

                // Вопрос 10
                new QuizAnswerOption { Id = 37, Text = "Кронос", IsCorrect = false, QuizQuestionId = 10 },
                new QuizAnswerOption { Id = 38, Text = "Гиперион", IsCorrect = false, QuizQuestionId = 10 },
                new QuizAnswerOption { Id = 39, Text = "Атлас", IsCorrect = true, QuizQuestionId = 10 },
                new QuizAnswerOption { Id = 40, Text = "Гигант", IsCorrect = false, QuizQuestionId = 10 }
            };

            modelBuilder.Entity<QuizAnswerOption>().HasData(answerOptions);


            base.OnModelCreating(modelBuilder);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(@"Server=DESKTOP-FNKSKPB;Database=BELLINI;User Id=sa;Password=sa;TrustServerCertificate=true;");
        }
    }
}
