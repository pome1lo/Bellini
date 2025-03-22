using BusinessLogicLayer.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using UtilsModelsLibrary.Enums;

namespace BusinessLogicLayer.Services
{
    public class FileService : IFileService
    {
        public async Task<string> UploadFileAsync(IFormFile file, CancellationToken cancellationToken = default, FileTypeUpload fileType = FileTypeUpload.Default, string prefixName = "")
        {
            string defaultPath;
            string wwwroot = "wwwroot";
            switch (fileType)
            {
                case FileTypeUpload.isAdminService: defaultPath = "../ProfileService/wwwroot/images"; break;
                case FileTypeUpload.isQuestionImageGameService: defaultPath = "wwwroot/questions-cover"; break;
                case FileTypeUpload.isQuizzesImageGameService: defaultPath = "wwwroot/quizzes-cover"; break;
                case FileTypeUpload.Default:
                default: defaultPath = "wwwroot/images"; break;
            }

            var filePath = Path.Combine(defaultPath, file.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream, cancellationToken);
            }
             
            return $"/{defaultPath}/{file.FileName}";
        } 
    }
}
