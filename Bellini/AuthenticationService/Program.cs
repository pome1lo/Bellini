using AuthenticationService.MiddlewareExtensions;
using BusinessLogic.Services;
using BusinessLogic.Services.DTOs;
using BusinessLogic.Services.Interfaces;
using BusinessLogic.Services.Validators;
using BusinessLogicLayer.Services;
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

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString(nameof(AppDbContext))));

builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis");
    options.InstanceName = "local";
});

builder.Services.AddScoped<IRepository<User>, UserRepository>();

builder.Services.AddScoped<IValidator<UserDto>, UserDtoValidator>();
builder.Services.AddScoped<IValidator<LoginDto>, LoginDtoValidator>();
builder.Services.AddScoped<IValidator<RegisterDto>, RegisterDtoValidator>();
builder.Services.AddScoped<IValidator<CheckEmailDto>, CheckEmailDtoValidator>();
builder.Services.AddScoped<IValidator<ResetPasswordDto>, ResetPasswordDtoValidator>();
builder.Services.AddScoped<IValidator<ChangePasswordDto>, ChangePasswordDtoValidator>();
builder.Services.AddScoped<IValidator<ForgotPasswordDto>, ForgotPasswordDtoValidator>();
builder.Services.AddScoped<IValidator<CodeVerificationDto>, CodeVerificationDtoValidator>();

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ILoginService, LoginService>();
builder.Services.AddScoped<IRegisterService, RegisterService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IPasswordService, PasswordService>();

builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddAutoMapper(cfg =>
{
    cfg.CreateMap<RegisterDto, UserDto>();
    cfg.CreateMap<User, UserDto>();
    cfg.CreateMap<RegisterDto, UserDto>()
        .ForMember(dest => dest.Id, opt => opt.Ignore());
    cfg.CreateMap<UserDto, User>();
}, typeof(Program));

builder.Services.AddControllers();

builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddCorsClient(builder.Configuration);

var app = builder.Build();
app.UseCors("AllowLocalhost5173");
app.UseGlobalExceptionHandler();

app.UseHttpsRedirection();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/", () => "The AuthenticationService is working.");

app.Run();
