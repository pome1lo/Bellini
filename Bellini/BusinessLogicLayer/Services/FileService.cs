using DataAccessLayer.Services.Interfaces;
using Microsoft.AspNetCore.Http;

namespace DataAccessLayer.Services
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
