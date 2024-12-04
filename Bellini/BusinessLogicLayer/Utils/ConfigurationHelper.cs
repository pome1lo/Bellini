using System.IO;
using DataAccessLayer.Services.DTOs;
using Microsoft.Extensions.Configuration;

namespace DataAccessLayer.Utils
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
