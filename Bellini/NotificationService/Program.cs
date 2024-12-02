using AuthenticationService.MiddlewareExtensions;
using BusinessLogicLayer.Services.Configs;
using BusinessLogicLayer.Services.Interfaces;
using DataAccessLayer.Data;
using DataAccessLayer.Data.Interfaces;
using DataAccessLayer.Data.Repositories;
using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCorsClient(builder.Configuration);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString(nameof(AppDbContext))));

builder.Services.AddControllers();


builder.Services.AddScoped<IRepository<Notification>, NotificationRepository>();
builder.Services.AddScoped<IRepository<User>, UserRepository>();


builder.Services.AddScoped<INotificationService, BusinessLogicLayer.Services.NotificationService>();


var app = builder.Build();


app.UseCors("AllowLocalhost5173");
app.UseGlobalExceptionHandler();

// Configure the HTTP request pipeline.
app.UseRouting();
app.UseHttpsRedirection();


app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.MapGet("/", () => "The NotificationService is working.");

app.Run();
