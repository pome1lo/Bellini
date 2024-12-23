using BusinessLogicLayer.Services.Configs;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
var builder = WebApplication.CreateBuilder(args);
System.Net.ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Gateway API",
        Version = "v1"
    });
});

builder.Services.AddCorsClient(builder.Configuration);
builder.Services.AddControllers();

var isDocker = Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true";

var ocelotConfigFile = isDocker ? "ocelot.docker.json" : "ocelot.local.json";

Console.ForegroundColor = ConsoleColor.Red;
Console.WriteLine(ocelotConfigFile);
Console.ForegroundColor = ConsoleColor.White;

builder.Configuration.SetBasePath(builder.Environment.ContentRootPath)
    .AddJsonFile(ocelotConfigFile, optional: false, reloadOnChange: true)
    .AddEnvironmentVariables();


builder.Services.AddOcelot(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowLocalhost5173");
app.UseHttpsRedirection();

app.UseRouting();


app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

await app.UseOcelot();

app.MapGet("/", () => "The ApiGateway is working.");

app.Run();
