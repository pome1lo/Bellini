using DataAccessLayer.Models;

namespace DataAccessLayer.Data.Interfaces
{
    public interface IRepository<T> where T : BaseModel
    {
        Task<IEnumerable<T>> GetElementsAsync(CancellationToken cancellationToken = default);
        Task<T> GetItemAsync(int id, CancellationToken cancellationToken = default);
        Task CreateAsync(T item, CancellationToken cancellationToken = default);
        Task UpdateAsync(int id, T item, CancellationToken cancellationToken = default);
        Task DeleteAsync(int id, CancellationToken cancellationToken = default);
    }
}
