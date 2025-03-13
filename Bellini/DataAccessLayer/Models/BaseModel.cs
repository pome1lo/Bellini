using DataAccessLayer.Data.Interfaces;

namespace DataAccessLayer.Models
{
    public abstract class BaseModel : IHasId
    {
        public int Id { get; set; }
    }
}
