using Microsoft.AspNetCore.Http;

namespace DataAccessLayer.Services.Interfaces
{
    public interface IFileService
    {
        Task<string> UploadFileAsync(IFormFile file, CancellationToken cancellationToken);
    }
}
