﻿using System;
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
                    IsDraft = table.Column<bool>(type: "bit", nullable: false),
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
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Username = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Password = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    IsEmailVerified = table.Column<bool>(type: "bit", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsAdmin = table.Column<bool>(type: "bit", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    LastName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ProfileImageUrl = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true)
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
                    EndTime = table.Column<DateTime>(type: "datetime2", nullable: false),
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
                name: "QuizComments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuizId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProfileImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CommentDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuizComments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuizComments_Quizzes_QuizId",
                        column: x => x.QuizId,
                        principalTable: "Quizzes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuizQuestions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Text = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    QuizId = table.Column<int>(type: "int", nullable: false),
                    QuizQuestionImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true)
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
                name: "Notifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Message = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsRead = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Notifications_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
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
                    IsReplay = table.Column<bool>(type: "bit", nullable: false),
                    EndTime = table.Column<DateTime>(type: "datetime2", nullable: false),
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
                name: "UserAchievements",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Achievement = table.Column<int>(type: "int", nullable: false),
                    AchievedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserAchievements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserAchievements_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserStatistics",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ProfileEdits = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    AvatarsSet = table.Column<int>(type: "int", nullable: false),
                    QuizzesCompleted = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    GamesPlayed = table.Column<int>(type: "int", nullable: false),
                    QuizComments = table.Column<int>(type: "int", nullable: false),
                    GameComments = table.Column<int>(type: "int", nullable: false),
                    QuizzesCreated = table.Column<int>(type: "int", nullable: false),
                    GameCreated = table.Column<int>(type: "int", nullable: false),
                    QuestionsCreated = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserStatistics", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserStatistics_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GameComments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GameId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProfileImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CommentDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameComments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GameComments_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GameResults",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NumberOfCorrectAnswers = table.Column<int>(type: "int", nullable: false),
                    NumberOfQuestions = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    GameId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameResults", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GameResults_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GameResults_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
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
                    QuestionImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
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
                columns: new[] { "Id", "EndTime", "GameCoverImageUrl", "GameName", "IsDraft", "StartTime" },
                values: new object[,]
                {
                    { 1, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/covers/quiz_1.jpg", "Мифология Древней Греции", false, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/covers/quiz_2.jpg", "Древний Рим", false, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 3, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/covers/quiz_3.jpg", "Современные технологии", false, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 4, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/covers/quiz_4.jpg", "Основы программирования", false, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 5, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/covers/quiz_5.jpg", "Продвинутое программирование", false, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "FirstName", "IsActive", "IsAdmin", "IsEmailVerified", "LastName", "Password", "ProfileImageUrl", "Username" },
                values: new object[,]
                {
                    { 1, "paaworker@gmail.com", "Main", true, true, true, "Admin", "$2a$11$9Y6i/HQgs1KnlFg6L29sI.SB3/HMIJ.zbZGrBg.8F9xTF6iHQblv6", "/apigateway/default/1.jpg", "administrator" },
                    { 2, "user1@example.com", "John", true, false, true, "Doe", "$2a$11$9Y6i/HQgs1KnlFg6L29sI.SB3/HMIJ.zbZGrBg.8F9xTF6iHQblv6", "/apigateway/default/1.jpg", "user1" },
                    { 3, "user2@example.com", "Jane", true, false, true, "Smith", "$2a$11$9Y6i/HQgs1KnlFg6L29sI.SB3/HMIJ.zbZGrBg.8F9xTF6iHQblv6", "/apigateway/default/2.jpg", "user2" },
                    { 4, "user3@example.com", "Mike", true, false, true, "Johnson", "$2a$11$9Y6i/HQgs1KnlFg6L29sI.SB3/HMIJ.zbZGrBg.8F9xTF6iHQblv6", "/apigateway/default/3.jpg", "user3" },
                    { 5, "user4@example.com", "Emily", true, false, true, "Brown", "$2a$11$9Y6i/HQgs1KnlFg6L29sI.SB3/HMIJ.zbZGrBg.8F9xTF6iHQblv6", "/apigateway/default/4.jpg", "user4" },
                    { 6, "user5@example.com", "David", true, false, true, "Davis", "$2a$11$9Y6i/HQgs1KnlFg6L29sI.SB3/HMIJ.zbZGrBg.8F9xTF6iHQblv6", "/apigateway/default/5.jpg", "user5" },
                    { 7, "user6@example.com", "Emma", true, false, true, "Miller", "$2a$11$9Y6i/HQgs1KnlFg6L29sI.SB3/HMIJ.zbZGrBg.8F9xTF6iHQblv6", "/apigateway/default/6.jpg", "user6" },
                    { 8, "user7@example.com", "Chris", true, false, true, "Wilson", "$2a$11$9Y6i/HQgs1KnlFg6L29sI.SB3/HMIJ.zbZGrBg.8F9xTF6iHQblv6", "/apigateway/default/7.jpg", "user7" },
                    { 9, "user8@example.com", "Sophia", true, false, true, "Moore", "$2a$11$9Y6i/HQgs1KnlFg6L29sI.SB3/HMIJ.zbZGrBg.8F9xTF6iHQblv6", "/apigateway/default/8.jpg", "user8" },
                    { 10, "user9@example.com", "Daniel", true, false, true, "Taylor", "$2a$11$9Y6i/HQgs1KnlFg6L29sI.SB3/HMIJ.zbZGrBg.8F9xTF6iHQblv6", "/apigateway/default/9.jpg", "user9" },
                    { 11, "user10@example.com", "Olivia", true, false, true, "Anderson", "$2a$11$9Y6i/HQgs1KnlFg6L29sI.SB3/HMIJ.zbZGrBg.8F9xTF6iHQblv6", "/apigateway/default/10.jpg", "user10" }
                });

            migrationBuilder.InsertData(
                table: "Games",
                columns: new[] { "Id", "CreateTime", "EndTime", "GameCoverImageUrl", "GameName", "GameStatusId", "HostId", "IsPrivate", "MaxPlayers", "RoomPassword", "StartTime" },
                values: new object[,]
                {
                    { 1, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/questions-cover/default/1.jpg", "Тайны древнего храма", 1, 1, false, 5, "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/questions-cover/default/2.jpg", "Гонка за артефактом", 1, 1, false, 6, "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 3, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/questions-cover/default/3.jpg", "Побег из подземелья", 1, 1, false, 7, "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 4, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/questions-cover/default/4.jpg", "Магический поединок", 1, 1, false, 8, "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 5, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/questions-cover/default/5.jpg", "Королевская битва", 1, 1, false, 9, "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 6, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/questions-cover/default/6.jpg", "Космическое приключение", 1, 1, false, 10, "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 7, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/questions-cover/default/7.jpg", "Выживание в пустыне", 1, 1, false, 4, "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 8, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/questions-cover/default/8.jpg", "Пиратские тайны", 1, 1, false, 5, "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 9, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/questions-cover/default/9.jpg", "Зомби-апокалипсис", 1, 1, false, 6, "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 10, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/questions-cover/default/10.jpg", "Миссия на Марс", 1, 1, false, 7, "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 11, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/questions-cover/default/11.jpg", "Осада замка", 1, 1, true, 8, "password", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 12, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/questions-cover/default/12.jpg", "Подводная экспедиция", 1, 1, true, 9, "password", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 13, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/questions-cover/default/13.jpg", "Шпионские интриги", 1, 1, true, 10, "password", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 14, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/questions-cover/default/14.jpg", "Операция: Побег", 1, 1, true, 4, "password", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 15, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/questions-cover/default/15.jpg", "Джунгли Амазонки", 1, 1, true, 5, "password", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 16, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/questions-cover/default/16.jpg", "Космический рейнджер", 1, 1, true, 6, "password", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 17, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/questions-cover/default/17.jpg", "Дикий Запад", 1, 1, true, 7, "password", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 18, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/questions-cover/default/18.jpg", "Средневековые войны", 1, 1, true, 8, "password", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 19, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/questions-cover/default/19.jpg", "Рыцарский турнир", 1, 1, true, 9, "password", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 20, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/questions-cover/default/20.jpg", "Выживание в Арктике", 1, 1, true, 10, "password", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 21, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/questions-cover/default/21.jpg", "Последняя битва", 3, 1, false, 4, "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 22, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/questions-cover/default/22.jpg", "Финальная миссия", 3, 1, false, 5, "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 23, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/questions-cover/default/23.jpg", "Освобождение города", 3, 1, false, 6, "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 24, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/questions-cover/default/24.jpg", "Падение империи", 3, 1, false, 7, "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 25, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/questions-cover/default/25.jpg", "Затерянные миры", 3, 1, false, 8, "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 26, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/questions-cover/default/26.jpg", "Код красный", 3, 1, false, 9, "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 27, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/questions-cover/default/27.jpg", "Тень прошлого", 3, 1, false, 10, "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 28, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/questions-cover/default/28.jpg", "Битва за будущее", 3, 1, false, 4, "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 29, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/questions-cover/default/29.jpg", "Последний шанс", 3, 1, false, 5, "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 30, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "/apigateway/questions-cover/default/30.jpg", "Взрывное противостояние", 3, 1, false, 6, "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) }
                });

            migrationBuilder.InsertData(
                table: "QuizQuestions",
                columns: new[] { "Id", "QuizId", "QuizQuestionImageUrl", "Text" },
                values: new object[,]
                {
                    { 1, 1, "", "Кто был верховным богом в греческой мифологии?" },
                    { 2, 1, "", "Какой бог был покровителем кузнецов и огня?" },
                    { 3, 1, "", "Кто был богом моря?" },
                    { 4, 1, "", "Кто был богиней мудрости?" },
                    { 5, 1, "", "Кто был богом войны?" },
                    { 6, 1, "", "Кто был богиней охоты?" },
                    { 7, 1, "", "Кто был вестником богов?" },
                    { 8, 1, "", "Кто был богом солнца?" },
                    { 9, 1, "", "Кто был богиней любви и красоты?" },
                    { 10, 1, "", "Кто был титаном, держащим небо на своих плечах?" },
                    { 11, 2, "", "Кто был основателем Рима?" },
                    { 12, 2, "", "Какой был последний император Рима?" },
                    { 13, 2, "", "Какой бог был покровителем Рима?" },
                    { 14, 2, "", "Какой праздник был посвящен славе императоров?" },
                    { 15, 2, "", "Кто был великим полководцем Рима?" },
                    { 16, 2, "", "Какое здание является символом Рима?" },
                    { 17, 2, "", "Какой язык был официальным в Риме?" },
                    { 18, 2, "", "Какое искусство было популярно в Риме?" },
                    { 19, 2, "", "Какой строй был установлен в Риме?" },
                    { 20, 2, "", "Какой век считается временем расцвета Рима?" },
                    { 21, 3, "", "Какой язык программирования чаще всего используется для создания машинного обучения?" },
                    { 22, 3, "", "Какой сервис используется для хранения проектов с контролем версий?" },
                    { 23, 3, "", "Какая компания разработала язык Swift?" },
                    { 24, 3, "", "Какой язык программирования чаще всего используется для веб-разработки на серверной стороне?" },
                    { 25, 3, "", "Какая система управления базами данных является популярной для больших данных?" },
                    { 26, 3, "", "Какой протокол используется для защиты данных при передаче в интернете?" },
                    { 27, 3, "", "Как называется популярный фреймворк для фронтенд-разработки от Facebook?" },
                    { 28, 3, "", "Какой язык программирования чаще всего используется для создания машинного обучения?" },
                    { 29, 3, "", "Какой текстовый редактор стал популярным благодаря расширяемости и множеству плагинов?" },
                    { 30, 3, "", "Как называется формат обмена данными, основанный на ключ-значение и часто используемый в API?" },
                    { 31, 4, "", "Что такое переменная?" },
                    { 32, 4, "", "Тип для чисел?" },
                    { 33, 4, "", "Что делает 'if'?" },
                    { 34, 4, "", "Как обозначается массив?" },
                    { 35, 4, "", "Что такое цикл?" },
                    { 36, 4, "", "Метод вывода?" },
                    { 37, 4, "", "Значение 'static'?" },
                    { 38, 4, "", "Не ООП язык?" },
                    { 39, 4, "", "Что такое метод?" },
                    { 40, 4, "", "Оператор равенства?" },
                    { 41, 5, "", "Какой ключевое слово используется для создания объекта?" },
                    { 42, 5, "", "Как называется способ скрытия данных внутри класса?" },
                    { 43, 5, "", "Что возвращает метод без возвращаемого значения?" },
                    { 44, 5, "", "Как называется базовый класс всех типов в C#?" },
                    { 45, 5, "", "Какой оператор используется для логического И?" },
                    { 46, 5, "", "Как называется процесс выполнения метода с тем же именем в дочернем классе?" },
                    { 47, 5, "", "Какой метод вызывается при создании объекта?" },
                    { 48, 5, "", "Какой тип данных используется для хранения текста?" },
                    { 49, 5, "", "Какой метод используется для завершения программы?" },
                    { 50, 5, "", "Как называется ошибка времени выполнения?" }
                });

            migrationBuilder.InsertData(
                table: "UserStatistics",
                columns: new[] { "Id", "AvatarsSet", "GameComments", "GameCreated", "GamesPlayed", "QuestionsCreated", "QuizComments", "QuizzesCreated", "UserId" },
                values: new object[,]
                {
                    { 1, 0, 0, 0, 0, 0, 0, 0, 1 },
                    { 2, 0, 0, 0, 0, 0, 0, 0, 2 },
                    { 3, 0, 0, 0, 0, 0, 0, 0, 3 },
                    { 4, 0, 0, 0, 0, 0, 0, 0, 4 },
                    { 5, 0, 0, 0, 0, 0, 0, 0, 5 },
                    { 6, 0, 0, 0, 0, 0, 0, 0, 6 },
                    { 7, 0, 0, 0, 0, 0, 0, 0, 7 },
                    { 8, 0, 0, 0, 0, 0, 0, 0, 8 },
                    { 9, 0, 0, 0, 0, 0, 0, 0, 9 },
                    { 10, 0, 0, 0, 0, 0, 0, 0, 10 },
                    { 11, 0, 0, 0, 0, 0, 0, 0, 11 }
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
                    { 80, false, 20, "I веке до н.э." },
                    { 81, false, 21, "Ruby" },
                    { 82, false, 21, "JavaScript" },
                    { 83, true, 21, "Python" },
                    { 84, false, 21, "Go" },
                    { 85, true, 22, "GitHub" },
                    { 86, false, 22, "Docker" },
                    { 87, false, 22, "Google Drive" },
                    { 88, false, 22, "Slack" },
                    { 89, true, 23, "Apple" },
                    { 90, false, 23, "Microsoft" },
                    { 91, false, 23, "Google" },
                    { 92, false, 23, "Amazon" },
                    { 93, false, 24, "JavaScript" },
                    { 94, false, 24, "Python" },
                    { 95, true, 24, "PHP" },
                    { 96, false, 24, "C++" },
                    { 97, false, 25, "MySQL" },
                    { 98, false, 25, "SQLite" },
                    { 99, true, 25, "Hadoop" },
                    { 100, false, 25, "Redis" },
                    { 101, false, 26, "TCP" },
                    { 102, false, 26, "UDP" },
                    { 103, true, 26, "TLS" },
                    { 104, false, 26, "FTP" },
                    { 105, false, 27, "Angular" },
                    { 106, false, 27, "Vue" },
                    { 107, true, 27, "React" },
                    { 108, false, 27, "Svelte" },
                    { 109, false, 28, "Ruby" },
                    { 110, false, 28, "JavaScript" },
                    { 111, true, 28, "Python" },
                    { 112, false, 28, "Go" },
                    { 113, true, 29, "Vim" },
                    { 114, false, 29, "Notepad" },
                    { 115, false, 29, "Paint" },
                    { 116, false, 29, "MS Word" },
                    { 117, false, 30, "XML" },
                    { 118, true, 30, "JSON" },
                    { 119, false, 30, "HTML" },
                    { 120, false, 30, "CSV" },
                    { 121, false, 31, "Объект" },
                    { 122, true, 31, "Память" },
                    { 123, false, 31, "Код" },
                    { 124, false, 31, "Тип" },
                    { 125, true, 32, "Int" },
                    { 126, false, 32, "String" },
                    { 127, false, 32, "Bool" },
                    { 128, false, 32, "Char" },
                    { 129, true, 33, "Условие" },
                    { 130, false, 33, "Цикл" },
                    { 131, false, 33, "Метод" },
                    { 132, false, 33, "Переменная" },
                    { 133, true, 34, "[]" },
                    { 134, false, 34, "{}" },
                    { 135, false, 34, "()" },
                    { 136, false, 34, "<>" },
                    { 137, true, 35, "Повтор" },
                    { 138, false, 35, "Условие" },
                    { 139, false, 35, "Класс" },
                    { 140, false, 35, "Массив" },
                    { 141, true, 36, "WriteLine" },
                    { 142, false, 36, "ReadLine" },
                    { 143, false, 36, "Print" },
                    { 144, false, 36, "Log" },
                    { 145, true, 37, "Без объекта" },
                    { 146, false, 37, "Общедоступный" },
                    { 147, false, 37, "Изменяемый" },
                    { 148, false, 37, "Скрытый" },
                    { 149, true, 38, "C" },
                    { 150, false, 38, "Java" },
                    { 151, false, 38, "C#" },
                    { 152, false, 38, "Python" },
                    { 153, true, 39, "Функция" },
                    { 154, false, 39, "Класс" },
                    { 155, false, 39, "Цикл" },
                    { 156, false, 39, "Переменная" },
                    { 157, true, 40, "==" },
                    { 158, false, 40, "=" },
                    { 159, false, 40, "!=" },
                    { 160, false, 40, "<>" },
                    { 161, true, 41, "new" },
                    { 162, false, 41, "var" },
                    { 163, false, 41, "class" },
                    { 164, false, 41, "using" },
                    { 165, true, 42, "Инкапсуляция" },
                    { 166, false, 42, "Наследование" },
                    { 167, false, 42, "Полиморфизм" },
                    { 168, false, 42, "Абстракция" },
                    { 169, true, 43, "void" },
                    { 170, false, 43, "null" },
                    { 171, false, 43, "object" },
                    { 172, false, 43, "int" },
                    { 173, true, 44, "Object" },
                    { 174, false, 44, "Base" },
                    { 175, false, 44, "System" },
                    { 176, false, 44, "Root" },
                    { 177, true, 45, "&&" },
                    { 178, false, 45, "&" },
                    { 179, false, 45, "||" },
                    { 180, false, 45, "!" },
                    { 181, true, 46, "Переопределение" },
                    { 182, false, 46, "Наследование" },
                    { 183, false, 46, "Инкапсуляция" },
                    { 184, false, 46, "Абстракция" },
                    { 185, true, 47, "Конструктор" },
                    { 186, false, 47, "Деструктор" },
                    { 187, false, 47, "Метод" },
                    { 188, false, 47, "Класс" },
                    { 189, true, 48, "string" },
                    { 190, false, 48, "char" },
                    { 191, false, 48, "text" },
                    { 192, false, 48, "var" },
                    { 193, true, 49, "Exit" },
                    { 194, false, 49, "Close" },
                    { 195, false, 49, "End" },
                    { 196, false, 49, "Return" },
                    { 197, true, 50, "Exception" },
                    { 198, false, 50, "Error" },
                    { 199, false, 50, "Bug" },
                    { 200, false, 50, "Crash" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AnswerOptions_QuestionId",
                table: "AnswerOptions",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_GameComments_GameId",
                table: "GameComments",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_GameResults_GameId",
                table: "GameResults",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_GameResults_UserId",
                table: "GameResults",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Games_GameStatusId",
                table: "Games",
                column: "GameStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_UserId",
                table: "Notifications",
                column: "UserId");

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
                name: "IX_QuizComments_QuizId",
                table: "QuizComments",
                column: "QuizId");

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

            migrationBuilder.CreateIndex(
                name: "IX_UserAchievements_UserId",
                table: "UserAchievements",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserStatistics_UserId",
                table: "UserStatistics",
                column: "UserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AnswerOptions");

            migrationBuilder.DropTable(
                name: "GameComments");

            migrationBuilder.DropTable(
                name: "GameResults");

            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.DropTable(
                name: "Players");

            migrationBuilder.DropTable(
                name: "QuizAnswerOptions");

            migrationBuilder.DropTable(
                name: "QuizComments");

            migrationBuilder.DropTable(
                name: "QuizResults");

            migrationBuilder.DropTable(
                name: "UserAchievements");

            migrationBuilder.DropTable(
                name: "UserStatistics");

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
