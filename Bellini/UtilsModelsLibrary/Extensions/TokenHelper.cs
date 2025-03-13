using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace UtilsModelsLibrary.Extensions
{
    public static class TokenHelper
    {
        public static string GetParameterFromToken(HttpContext context, string claim = ClaimTypes.NameIdentifier)
        {
            var paramClaim = context.User.FindFirst(claim);
            if (paramClaim is null)
            {
                throw new UnauthorizedAccessException();
            }

            return paramClaim.Value;
        }
    }
}
