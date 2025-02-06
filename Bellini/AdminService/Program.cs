using AdminService.MiddlewareExtensions;
using BusinessLogicLayer.Services;
using BusinessLogicLayer.Services.Configs;
using BusinessLogicLayer.Services.Interfaces;
using DataAccessLayer.Data;
using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Data.Repositories;
using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

var isDocker = Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Admin Service API",
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

builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = isDocker
        ? "redis_db:6379" // Адрес Redis-сервера в Docker
        : builder.Configuration.GetConnectionString("Redis");
    options.InstanceName = "local";
});

builder.Services.AddControllers();

builder.Services.AddScoped<IRepository<User>, UserRepository>();
builder.Services.AddScoped<IRepository<Game>, GameRepository>();
builder.Services.AddScoped<IRepository<Quiz>, QuizRepository>();
builder.Services.AddScoped<IRepository<Notification>, NotificationRepository>();


builder.Services.AddScoped<IAdminService, BusinessLogicLayer.Services.AdminService>();
builder.Services.AddScoped<INotificationService, NotificationService>();

builder.Services.AddJwtAuthentication(builder.Configuration);

var app = builder.Build();


app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowLocalhost5173");
app.UseGlobalExceptionHandler();

// Configure the HTTP request pipeline.
app.UseRouting();
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();


app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});


app.MapControllers();

app.MapGet("/", () => "The Admin is working.");

app.Run();
