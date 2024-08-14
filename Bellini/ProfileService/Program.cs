using AuthenticationService.MiddlewareExtensions;

var builder = WebApplication.CreateBuilder(args);
 
builder.Services.AddControllers();

 

var app = builder.Build();
 
app.UseGlobalExceptionHandler();

 
app.UseHttpsRedirection();

app.MapControllers();

app.MapGet("/", () => "Hello world!");

app.Run();
 