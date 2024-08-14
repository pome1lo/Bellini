using System.IO;
using BusinessLogicLayer.Services.DTOs;
using Microsoft.Extensions.Configuration;

namespace BusinessLogicLayer.Utils
{
    public class ConfigurationHelper
    {
        public static EmailSettingsDto GetEmailSettings()
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(AppContext.BaseDirectory)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .Build();

            var emailSettings = new EmailSettingsDto();
            configuration.GetSection("EmailSettings").Bind(emailSettings);

            return emailSettings;
        }
    }
}
