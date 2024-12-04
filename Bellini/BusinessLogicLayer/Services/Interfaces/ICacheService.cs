namespace DataAccessLayer.Services.Interfaces
{
    public interface ICacheService
    {
        Task SetAsync(string key, object value, TimeSpan expiry);
        Task<T?> GetAsync<T>(string key);
        Task RemoveAsync(string key);
    }
}
