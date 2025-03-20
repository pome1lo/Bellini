using BusinessLogicLayer.Services.Interfaces;
using Microsoft.AspNetCore.Http;

namespace BusinessLogicLayer.Services
{
    public class FileService : IFileService
    {
        public async Task<string> UploadFileAsync(IFormFile file, CancellationToken cancellationToken = default, bool isAdminService = false)
        {
            var defaultPath = (isAdminService ? "../ProfileService/" : "")  + "wwwroot/images";

            var filePath = Path.Combine(defaultPath, file.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream, cancellationToken);
            }

            return $"/images/{file.FileName}";
        }
    }
}
