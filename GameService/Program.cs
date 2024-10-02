using BusinessLogicLayer.Services.Interfaces;
using DataAccess.Data;
using DataAccess.Data.Interfaces;
using DataAccess.Models;
using DataAccessLayer.Data.Repositories;
using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString(nameof(AppDbContext))));

builder.Services.AddControllers();

builder.Services.AddScoped<IRepository<Game>, GameRepository>();
builder.Services.AddScoped<IRepository<Player>, PlayerRepository>();
builder.Services.AddScoped<IRepository<Comment>, CommentRepository>();
builder.Services.AddScoped<IRepository<Category>, CategoryRepository>();


builder.Services.AddScoped<IGameService, BusinessLogicLayer.Services.GameService>();


var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseRouting();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.MapGet("/", () => "The GameService is working.");

app.Run();

app.Run();
