namespace BusinessLogicLayer.Services.Interfaces
{
    public interface ICacheService
    {
        /// <summary>
        /// Сохраняет объект в кэше с заданным сроком хранения.
        /// </summary>
        /// <param name="key">Ключ, по которому будет храниться объект.</param>
        /// <param name="value">Объект для сохранения.</param>
        /// <param name="expiry">Время жизни объекта в кэше.</param>
        Task SetAsync(string key, object value, TimeSpan expiry);

        /// <summary>
        /// Получает объект из кэша по ключу.
        /// </summary>
        /// <typeparam name="T">Тип объекта.</typeparam>
        /// <param name="key">Ключ, по которому хранится объект.</param>
        /// <returns>Объект из кэша или null, если ключ не найден.</returns>
        Task<T?> GetAsync<T>(string key);

        /// <summary>
        /// Удаляет объект из кэша по ключу.
        /// </summary>
        /// <param name="key">Ключ объекта для удаления.</param>
        Task RemoveAsync(string key);

        /// <summary>
        /// Пытается удалить объект из кэша по ключу.
        /// </summary>
        /// <param name="key">Ключ объекта для удаления.</param>
        /// <returns>True, если объект был удален, иначе False.</returns>
        Task<bool> TryRemoveAsync(string key);

    }
}
