using Microsoft.AspNetCore.Http;

namespace BusinessLogicLayer.Services.Interfaces
{
    public interface IFileService
    {
        Task<string> UploadFileAsync(IFormFile file, CancellationToken cancellationToken);
    }
}
