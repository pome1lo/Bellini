using AuthenticationService.MiddlewareExtensions;
using BusinessLogic.Services;
using BusinessLogic.Services.DTOs;
using BusinessLogic.Services.Interfaces;
using BusinessLogic.Services.Validators;
using BusinessLogicLayer.Services;
using BusinessLogicLayer.Services.DTOs;
using BusinessLogicLayer.Services.Interfaces;
using BusinessLogicLayer.Services.Validators;
using DataAccess.Data;
using DataAccess.Data.Interfaces;
using DataAccess.Data.Repositories;
using DataAccess.Models;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString(nameof(AppDbContext))));

// Configure the HTTP request pipeline.
builder.Services.AddScoped<IRepository<User>, UserRepository>();

builder.Services.AddScoped<IValidator<UserDto>, UserDtoValidator>();
builder.Services.AddScoped<IValidator<LoginDto>, LoginDtoValidator>();
builder.Services.AddScoped<IValidator<RegisterDto>, RegisterDtoValidator>();
builder.Services.AddScoped<IValidator<ResetPasswordDto>, ResetPasswordDtoValidator>();
builder.Services.AddScoped<IValidator<ChangePasswordDto>, ChangePasswordDtoValidator>();
builder.Services.AddScoped<IValidator<ForgotPasswordDto>, ForgotPasswordDtoValidator>();

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ILoginService, LoginService>();
builder.Services.AddScoped<IRegisterService, RegisterService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IPasswordService, PasswordService>();

// Configure AutoMapper
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddAutoMapper(cfg =>
{
    cfg.CreateMap<RegisterDto, UserDto>();
    cfg.CreateMap<User, UserDto>();
    cfg.CreateMap<RegisterDto, UserDto>()
        .ForMember(dest => dest.Id, opt => opt.Ignore());
    cfg.CreateMap<UserDto, User>();
}, typeof(Program));


// Add controllers
builder.Services.AddControllers();

// Configure JWT authentication

var key = Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"]);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});


builder.Services.AddAuthorization();

var app = builder.Build();

// Configure global exception handler
app.UseGlobalExceptionHandler();

// Configure the HTTP request pipeline.
app.UseHttpsRedirection();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/", () => "Hello world!");

app.Run();
