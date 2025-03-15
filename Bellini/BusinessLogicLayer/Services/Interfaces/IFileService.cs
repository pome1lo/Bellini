using Microsoft.AspNetCore.Http;

namespace BusinessLogicLayer.Services.Interfaces
{
    public interface IFileService
    {
        /// <summary>
        /// Загружает файл и возвращает путь к нему.
        /// </summary>
        /// <param name="file">Файл для загрузки.</param>
        /// <param name="cancellationToken">Токен отмены операции.</param>
        /// <returns>Путь к загруженному файлу.</returns>
        Task<string> UploadFileAsync(IFormFile file, CancellationToken cancellationToken);
    }
}
