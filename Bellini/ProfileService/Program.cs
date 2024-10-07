using AuthenticationService.MiddlewareExtensions;
using BusinessLogic.Services.DTOs;
using BusinessLogic.Services.Validators;
using BusinessLogicLayer.Services.Configs;
using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using BusinessLogicLayer.Services.Validators;
using DataAccess.Data;
using DataAccess.Data.Interfaces;
using DataAccess.Data.Repositories;
using DataAccess.Models;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString(nameof(AppDbContext))));

builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis");
    options.InstanceName = "local";
});

builder.Services.AddScoped<IRepository<User>, UserRepository>();
builder.Services.AddScoped<IValidator<UserDto>, UserDtoValidator>();
builder.Services.AddScoped<IValidator<ProfileDto>, ProfileDtoValidator>();
builder.Services.AddScoped<IValidator<UpdateProfileDto>, UpdateProfileDtoValidator>();

builder.Services.AddScoped<IProfileService, BusinessLogicLayer.Services.ProfileService>();
builder.Services.AddScoped<IFileService, BusinessLogicLayer.Services.FileService>();

builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddAutoMapper(cfg =>
{
    cfg.CreateMap<User, UserDto>();
    cfg.CreateMap<User, ProfileDto>();
    cfg.CreateMap<ProfileDto, User>();
    cfg.CreateMap<UpdateProfileDto, User>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
}, typeof(Program));

builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddCorsClient(builder.Configuration);


var app = builder.Build();

app.UseCors("AllowLocalhost5173");
app.UseStaticFiles();

app.UseGlobalExceptionHandler();

app.UseAuthentication();
app.UseAuthorization();
app.UseHttpsRedirection();

app.MapControllers();

app.MapGet("/", () => "The ProfileService is working.");

app.Run();
