﻿namespace BusinessLogicLayer.Services.Interfaces
{
    public interface ICacheService
    {
        Task SetAsync(string key, object value, TimeSpan expiry);
        Task<T?> GetAsync<T>(string key);
        Task RemoveAsync(string key);
        Task<bool> TryRemoveAsync(string key);
    }
}
