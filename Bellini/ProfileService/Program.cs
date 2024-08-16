using AuthenticationService.MiddlewareExtensions;
using BusinessLogic.Services.DTOs;
using BusinessLogic.Services.Validators;
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

builder.Services.AddScoped<IRepository<User>, UserRepository>();
builder.Services.AddScoped<IValidator<UserDto>, UserDtoValidator>();
builder.Services.AddScoped<IValidator<ProfileDto>, ProfileDtoValidator>();
builder.Services.AddScoped<IValidator<UpdateProfileDto>, UpdateProfileDtoValidator>(); 
builder.Services.AddScoped<IProfileService, BusinessLogicLayer.Services.ProfileService>();
 
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddAutoMapper(cfg =>
{
    cfg.CreateMap<User, UserDto>(); 
    cfg.CreateMap<User, ProfileDto>(); 
    cfg.CreateMap<ProfileDto, User>();
    cfg.CreateMap<UpdateProfileDto, User>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
}, typeof(Program));

var app = builder.Build();

app.UseGlobalExceptionHandler();


app.UseHttpsRedirection();

app.MapControllers();

app.MapGet("/", () => "Hello world!");

app.Run();
