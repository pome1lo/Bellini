using BusinessLogicLayer.Hubs;
using BusinessLogicLayer.Services;
using BusinessLogicLayer.Services.Configs;
using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using DataAccessLayer.Data;
using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Data.Repositories;
using DataAccessLayer.Models;
using GameService.MiddlewareExtensions;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;

var isDocker = Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Game Service API",
        Version = "v1"
    });
});
builder.Services.AddCorsClient(builder.Configuration);

builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connectionString = isDocker
        ? "Server=sqlserver;Database=BELLINI;User Id=sa;Password=StrongPassword123!;TrustServerCertificate=true;"
        : builder.Configuration.GetConnectionString(nameof(AppDbContext));
    options.UseSqlServer(connectionString);
});


builder.Services.AddSingleton<IConnectionMultiplexer>(provider =>
{
    var redisConnection = isDocker ? "redis_db:6379" : "localhost";
    return ConnectionMultiplexer.Connect(redisConnection);
});

builder.Services.AddControllers();

builder.Services.AddScoped<IRepository<Game>, GameRepository>();
builder.Services.AddScoped<IRepository<Player>, PlayerRepository>();
builder.Services.AddScoped<IRepository<GameComment>, GameCommentRepository>();
builder.Services.AddScoped<IRepository<QuizComment>, QuizCommentRepository>();
builder.Services.AddScoped<IRepository<Question>, QuestionRepository>();
builder.Services.AddScoped<IRepository<GameStatus>, GameStatusRepository>();
builder.Services.AddScoped<IRepository<AnswerOption>, AnswerOptionRepository>();
builder.Services.AddScoped<IRepository<Notification>, NotificationRepository>();
builder.Services.AddScoped<IRepository<User>, UserRepository>();

builder.Services.AddScoped<IRepository<Quiz>, QuizRepository>();
builder.Services.AddScoped<IRepository<QuizQuestion>, QuizQuestionRepository>();
builder.Services.AddScoped<IRepository<QuizAnswerOption>, QuizAnswerOptionRepository>();
builder.Services.AddScoped<IRepository<QuizResults>, QuizResultsRepository>();
builder.Services.AddScoped<IRepository<GameResults>, GameResultsRepository>();

builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IGameService, BusinessLogicLayer.Services.GameService>();
builder.Services.AddScoped<IQuizService, QuizService>();
builder.Services.AddScoped<ICommentService, CommentService>();
builder.Services.AddScoped<IQuestionService, QuestionService>();

builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddAutoMapper(cfg =>
{
    cfg.CreateMap<Game, GameDto>()
        .ForMember(dest => dest.GameStatus, opt => opt.MapFrom(src => src.Status));
    cfg.CreateMap<CreateGameRoomDto, Game>();
    cfg.CreateMap<Player, PlayerDto>();
    cfg.CreateMap<GameComment, CommentDto>();
    cfg.CreateMap<CreateQuestionDto, Question>();
    cfg.CreateMap<CreateAnswerDto, AnswerOption>();
}, typeof(Program));

builder.Services.AddJwtAuthentication(builder.Configuration);

if (isDocker)
{
    builder.Services.AddSignalR(options =>
    {
        options.EnableDetailedErrors = true;
        options.KeepAliveInterval = TimeSpan.FromSeconds(30);
        options.ClientTimeoutInterval = TimeSpan.FromMinutes(2);
    });
}
else
{
    builder.Services.AddSignalR();
}

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowLocalhost5173");
app.UseStaticFiles();

app.UseRouting();
app.UseGlobalExceptionHandler();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<GameHub>("/gameHub");
    endpoints.MapControllers();
});

app.MapGet("/", () => "The GameService is working.");

app.Run();
