namespace BusinessLogicLayer.Utils
{
    public static class VerificationCodeGenerator
    {
        public static string GenerateVerificationCode()
        {
            return new Random().Next(100000, 999999).ToString();
        }

        public static string GenerateRegistrationCode()
        {
            return new Random().Next(100000, 999999).ToString();
        }
    }
}
