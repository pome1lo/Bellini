using BusinessLogicLayer.Hubs;
using BusinessLogicLayer.Services.Configs;
using BusinessLogicLayer.Services.Interfaces;
using DataAccess.Data;
using DataAccess.Data.Interfaces;
using DataAccess.Models;
using DataAccessLayer.Data.Repositories;
using DataAccessLayer.Models;
using GameService.MiddlewareExtensions;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCorsClient(builder.Configuration);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString(nameof(AppDbContext))));

builder.Services.AddControllers();

builder.Services.AddScoped<IRepository<Game>, GameRepository>();
builder.Services.AddScoped<IRepository<Player>, PlayerRepository>();
builder.Services.AddScoped<IRepository<Comment>, CommentRepository>();
builder.Services.AddScoped<IRepository<GameStatus>, GameStatusRepository>();

builder.Services.AddSingleton<IConnectionMultiplexer>(ConnectionMultiplexer.Connect("localhost"));

builder.Services.AddScoped<IGameService, BusinessLogicLayer.Services.GameService>();

builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddSignalR();

var app = builder.Build();

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
    app.MapControllers();
});

app.MapGet("/", () => "The GameService is working.");

app.Run();

app.Run();