using AuthenticationService.MiddlewareExtensions;
using DataAccess.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString(nameof(AppDbContext))));

//builder.Services.AddScoped<IRegisterService, RegisterService>();

// Add controllers
builder.Services.AddControllers();


var app = builder.Build();

// Configure global exception handler
app.UseGlobalExceptionHandler();

// Configure the HTTP request pipeline.
app.UseHttpsRedirection();

app.UseRouting();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.MapGet("/", () => "The NotificationService is working.");

app.Run();
