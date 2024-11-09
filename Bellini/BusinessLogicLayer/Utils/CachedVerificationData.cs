namespace BusinessLogicLayer.Utils
{
    public class CachedVerificationData
    {
        public string Code { get; set; } = null!;
        public DateTime Expiry { get; set; }
    }
}
