using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace UtilsModelsLibrary.Attributes
{
    public class AdminOnlyAuthorizeAttribute : AuthorizeAttribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var roleClaim = context.HttpContext.User.FindFirst(ClaimTypes.Role);
            if (roleClaim is null || !roleClaim.Value.Equals("Admin"))
            {
                context.Result = new ForbidResult();
            }
        }
    }
}
