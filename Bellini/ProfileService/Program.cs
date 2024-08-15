using AuthenticationService.MiddlewareExtensions;
using BusinessLogicLayer.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddScoped<IProfileService, BusinessLogicLayer.Services.ProfileService>();

var app = builder.Build();

app.UseGlobalExceptionHandler();


app.UseHttpsRedirection();

app.MapControllers();

app.MapGet("/", () => "Hello world!");

app.Run();
