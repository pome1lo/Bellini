using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;
using UtilsModelsLibrary.Base;
using UtilsModelsLibrary.Enums;

namespace UtilsModelsLibrary.Attributes
{
    public class RolesOnlyAuthorizeAttribute : AuthorizeAttribute, IAuthorizationFilter
    {
        public Roles RolePropertyName { get; set; }

        public RolesOnlyAuthorizeAttribute(Roles RolePropertyName)
        {
            this.RolePropertyName = RolePropertyName;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var roleClaim = context.HttpContext.User.FindFirst(ClaimTypes.Role);
            if (roleClaim is null || (!roleClaim.Value.Equals(RolePropertyName.GetDescription()) && !roleClaim.Value.Equals(Enums.Roles.Admin.GetDescription())))
            {
                context.Result = new ForbidResult();
            }
        }
    }
}
