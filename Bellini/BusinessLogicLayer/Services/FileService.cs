using BusinessLogicLayer.Services.Interfaces;
using Microsoft.AspNetCore.Http;

namespace BusinessLogicLayer.Services
{
    public class FileService : IFileService
    {
        public async Task<string> UploadFileAsync(IFormFile file, CancellationToken cancellationToken)
        {
            var filePath = Path.Combine("wwwroot/images", file.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream, cancellationToken);
            }

            return $"/images/{file.FileName}";
        }
    }
}
