using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GameStatuses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameStatuses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Quizzes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GameName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    GameCoverImageUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    StartTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndTime = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Quizzes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RegistrationCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VerificationCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VerificationCodeExpiry = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ProfileImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Games",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GameName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    HostId = table.Column<int>(type: "int", nullable: false),
                    CreateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    StartTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MaxPlayers = table.Column<int>(type: "int", nullable: false),
                    GameCoverImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsPrivate = table.Column<bool>(type: "bit", nullable: false),
                    RoomPassword = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    GameStatusId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Games", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Games_GameStatuses_GameStatusId",
                        column: x => x.GameStatusId,
                        principalTable: "GameStatuses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "QuizQuestions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Text = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    QuizId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuizQuestions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuizQuestions_Quizzes_QuizId",
                        column: x => x.QuizId,
                        principalTable: "Quizzes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuizResults",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NumberOfCorrectAnswers = table.Column<int>(type: "int", nullable: false),
                    NumberOfQuestions = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    QuizId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuizResults", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuizResults_Quizzes_QuizId",
                        column: x => x.QuizId,
                        principalTable: "Quizzes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuizResults_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Comments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GameId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    CommentDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Comments_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Players",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GameId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Score = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Players", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Players_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Players_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Questions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Text = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    GameId = table.Column<int>(type: "int", nullable: false),
                    IsCustom = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Questions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Questions_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuizAnswerOptions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Text = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    IsCorrect = table.Column<bool>(type: "bit", nullable: false),
                    QuizQuestionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuizAnswerOptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuizAnswerOptions_QuizQuestions_QuizQuestionId",
                        column: x => x.QuizQuestionId,
                        principalTable: "QuizQuestions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AnswerOptions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Text = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    IsCorrect = table.Column<bool>(type: "bit", nullable: false),
                    QuestionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnswerOptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AnswerOptions_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "Questions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "GameStatuses",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Not started" },
                    { 2, "In process" },
                    { 3, "Completed" }
                });

            migrationBuilder.InsertData(
                table: "Quizzes",
                columns: new[] { "Id", "EndTime", "GameCoverImageUrl", "GameName", "StartTime" },
                values: new object[,]
                {
                    { 1, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "https://i.pinimg.com/originals/b3/7e/4f/b37e4fd167bd9e14558dd14301ec6487.jpg", "Мифология Древней Греции", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "https://i.pinimg.com/originals/b3/7e/4f/b37e4fd167bd9e14558dd14301ec6487.jpg", "Древний Рим", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) }
                });

            migrationBuilder.InsertData(
                table: "QuizQuestions",
                columns: new[] { "Id", "QuizId", "Text" },
                values: new object[,]
                {
                    { 1, 1, "Кто был верховным богом в греческой мифологии?" },
                    { 2, 1, "Какой бог был покровителем кузнецов и огня?" },
                    { 3, 1, "Кто был богом моря?" },
                    { 4, 1, "Кто был богиней мудрости?" },
                    { 5, 1, "Кто был богом войны?" },
                    { 6, 1, "Кто был богиней охоты?" },
                    { 7, 1, "Кто был вестником богов?" },
                    { 8, 1, "Кто был богом солнца?" },
                    { 9, 1, "Кто был богиней любви и красоты?" },
                    { 10, 1, "Кто был титаном, держащим небо на своих плечах?" },
                    { 11, 2, "Кто был основателем Рима?" },
                    { 12, 2, "Какой был последний император Рима?" },
                    { 13, 2, "Какой бог был покровителем Рима?" },
                    { 14, 2, "Какой праздник был посвящен славе императоров?" },
                    { 15, 2, "Кто был великим полководцем Рима?" },
                    { 16, 2, "Какое здание является символом Рима?" },
                    { 17, 2, "Какой язык был официальным в Риме?" },
                    { 18, 2, "Какое искусство было популярно в Риме?" },
                    { 19, 2, "Какой строй был установлен в Риме?" },
                    { 20, 2, "Какой век считается временем расцвета Рима?" }
                });

            migrationBuilder.InsertData(
                table: "QuizAnswerOptions",
                columns: new[] { "Id", "IsCorrect", "QuizQuestionId", "Text" },
                values: new object[,]
                {
                    { 1, false, 1, "Посейдон" },
                    { 2, false, 1, "Геракл" },
                    { 3, true, 1, "Зевс" },
                    { 4, false, 1, "Аполлон" },
                    { 5, false, 2, "Арес" },
                    { 6, true, 2, "Гефест" },
                    { 7, false, 2, "Аполлон" },
                    { 8, false, 2, "Зевс" },
                    { 9, false, 3, "Гермес" },
                    { 10, true, 3, "Посейдон" },
                    { 11, false, 3, "Дионис" },
                    { 12, false, 3, "Афина" },
                    { 13, false, 4, "Гера" },
                    { 14, true, 4, "Афина" },
                    { 15, false, 4, "Артемида" },
                    { 16, false, 4, "Персефона" },
                    { 17, false, 5, "Гермес" },
                    { 18, true, 5, "Арес" },
                    { 19, false, 5, "Зевс" },
                    { 20, false, 5, "Аполлон" },
                    { 21, false, 6, "Гера" },
                    { 22, true, 6, "Артемида" },
                    { 23, false, 6, "Афродита" },
                    { 24, false, 6, "Афина" },
                    { 25, true, 7, "Гермес" },
                    { 26, false, 7, "Аполлон" },
                    { 27, false, 7, "Арес" },
                    { 28, false, 7, "Дионис" },
                    { 29, false, 8, "Арес" },
                    { 30, true, 8, "Аполлон" },
                    { 31, false, 8, "Зевс" },
                    { 32, false, 8, "Гермес" },
                    { 33, false, 9, "Афина" },
                    { 34, false, 9, "Артемида" },
                    { 35, true, 9, "Афродита" },
                    { 36, false, 9, "Гера" },
                    { 37, false, 10, "Кронос" },
                    { 38, false, 10, "Гиперион" },
                    { 39, true, 10, "Атлас" },
                    { 40, false, 10, "Гигант" },
                    { 41, true, 11, "Ромул" },
                    { 42, false, 11, "Рем" },
                    { 43, false, 11, "Цезарь" },
                    { 44, false, 11, "Август" },
                    { 45, false, 12, "Нерон" },
                    { 46, true, 12, "Август" },
                    { 47, false, 12, "Тиберий" },
                    { 48, false, 12, "Клавдий" },
                    { 49, true, 13, "Юпитер" },
                    { 50, false, 13, "Марс" },
                    { 51, false, 13, "Венера" },
                    { 52, false, 13, "Сатурн" },
                    { 53, false, 14, "Панем" },
                    { 54, false, 14, "Луперкалии" },
                    { 55, true, 14, "Тритон" },
                    { 56, false, 14, "Сатурналии" },
                    { 57, true, 15, "Ганнибал" },
                    { 58, false, 15, "Цезарь" },
                    { 59, false, 15, "Октавиан" },
                    { 60, false, 15, "Сципион" },
                    { 61, true, 16, "Колизей" },
                    { 62, false, 16, "Пантеон" },
                    { 63, false, 16, "Форум" },
                    { 64, false, 16, "Кирка" },
                    { 65, true, 17, "Латинский" },
                    { 66, false, 17, "Греческий" },
                    { 67, false, 17, "Еврейский" },
                    { 68, false, 17, "Арабский" },
                    { 69, true, 18, "Архитектура" },
                    { 70, false, 18, "Живопись" },
                    { 71, false, 18, "Музыка" },
                    { 72, false, 18, "Скульптура" },
                    { 73, false, 19, "Монархия" },
                    { 74, true, 19, "Республика" },
                    { 75, false, 19, "Демократия" },
                    { 76, false, 19, "Олигархия" },
                    { 77, false, 20, "V веке до н.э." },
                    { 78, true, 20, "IV веке н.э." },
                    { 79, false, 20, "III веке до н.э." },
                    { 80, false, 20, "I веке до н.э." }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AnswerOptions_QuestionId",
                table: "AnswerOptions",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_GameId",
                table: "Comments",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_Games_GameStatusId",
                table: "Games",
                column: "GameStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_Players_GameId",
                table: "Players",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_Players_UserId",
                table: "Players",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Questions_GameId",
                table: "Questions",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizAnswerOptions_QuizQuestionId",
                table: "QuizAnswerOptions",
                column: "QuizQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizQuestions_QuizId",
                table: "QuizQuestions",
                column: "QuizId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizResults_QuizId",
                table: "QuizResults",
                column: "QuizId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizResults_UserId",
                table: "QuizResults",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AnswerOptions");

            migrationBuilder.DropTable(
                name: "Comments");

            migrationBuilder.DropTable(
                name: "Players");

            migrationBuilder.DropTable(
                name: "QuizAnswerOptions");

            migrationBuilder.DropTable(
                name: "QuizResults");

            migrationBuilder.DropTable(
                name: "Questions");

            migrationBuilder.DropTable(
                name: "QuizQuestions");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Games");

            migrationBuilder.DropTable(
                name: "Quizzes");

            migrationBuilder.DropTable(
                name: "GameStatuses");
        }
    }
}
