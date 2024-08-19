using BusinessLogicLayer.Services.Configs;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var isDocker = Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true";
var ocelotConfigFile = isDocker ? "ocelot.docker.json" : "ocelot.local.json";

builder.Configuration.SetBasePath(builder.Environment.ContentRootPath)
    .AddJsonFile(ocelotConfigFile, optional: false, reloadOnChange: true)
    .AddEnvironmentVariables();

builder.Services.AddOcelot(builder.Configuration);
builder.Services.AddCorsClient(builder.Configuration);

var app = builder.Build();
app.UseCors("AllowLocalhost5173");
app.UseHttpsRedirection();

app.UseRouting();

 
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

await app.UseOcelot();

app.MapGet("/", () => "The ApiGateway is working.");

app.Run();
