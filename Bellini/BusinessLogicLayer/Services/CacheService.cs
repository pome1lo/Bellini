using BusinessLogicLayer.Services.Interfaces;
using StackExchange.Redis;
using System.Text.Json;

namespace BusinessLogicLayer.Services
{
    public class CacheService : ICacheService
    {
        private readonly IConnectionMultiplexer _redis;

        public CacheService(IConnectionMultiplexer redis)
        {
            _redis = redis;
        }

        public async Task SetAsync(string key, object value, TimeSpan expiry)
        {
            var db = _redis.GetDatabase();
            var json = JsonSerializer.Serialize(value);
            await db.StringSetAsync(key, json, expiry);
        }

        public async Task<T?> GetAsync<T>(string key)
        {
            var db = _redis.GetDatabase();
            var json = await db.StringGetAsync(key);
            return json.HasValue ? JsonSerializer.Deserialize<T>(json) : default;
        }

        public async Task RemoveAsync(string key)
        {
            var db = _redis.GetDatabase();
            await db.KeyDeleteAsync(key);
        }

        public async Task<bool> TryRemoveAsync(string key)
        {
            var db = _redis.GetDatabase();
            return await db.KeyExistsAsync(key) && await db.KeyDeleteAsync(key);
        }
    }
}
