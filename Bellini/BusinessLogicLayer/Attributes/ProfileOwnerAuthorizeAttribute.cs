using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace DataAccessLayer.Attribute
{
    public class ProfileOwnerAuthorizeAttribute : AuthorizeAttribute, IAuthorizationFilter
    {
        public string IdParameterName { get; set; } = "id";

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var userIdClaim = context.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim is null)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var userId = int.Parse(userIdClaim.Value);
            var routeData = context.RouteData.Values[IdParameterName];
            if (routeData is null || !int.TryParse(routeData.ToString(), out int routeId) || userId != routeId)
            {
                context.Result = new ForbidResult();
            }
        }
    }
}
