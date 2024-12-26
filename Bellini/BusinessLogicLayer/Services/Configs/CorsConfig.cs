using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace BusinessLogicLayer.Services.Configs
{
    public static class CorsConfig
    {
        public static void AddCorsClient(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowLocalhost5173",
                    builder =>
                    {
                        builder.WithOrigins(
                            "http://localhost:5173", "https://localhost:5173",
                            "http://localhost:3000", "https://localhost:3000",
                            "https://localhost:8443", "http://reactapp:3000",
                            "https://apigateway", "https://reactapp:8443"
                            )
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .AllowCredentials();

                    });
            });
        }
    }
}
