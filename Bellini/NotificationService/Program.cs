using AuthenticationService.MiddlewareExtensions;

var builder = WebApplication.CreateBuilder(args);

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

app.MapGet("/", () => "Hello world!");

app.Run();
