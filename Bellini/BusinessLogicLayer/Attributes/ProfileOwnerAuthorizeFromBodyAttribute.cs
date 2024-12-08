using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;
using System.Text.Json;

namespace BusinessLogicLayer.Attributes
{
    public class ProfileOwnerAuthorizeFromBodyAttribute : AuthorizeAttribute, IAsyncAuthorizationFilter
    {
        public string UserIdPropertyName { get; set; } = "userId";

        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            var userIdClaim = context.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim is null)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var userId = int.Parse(userIdClaim.Value);

            var httpRequest = context.HttpContext.Request;

            httpRequest.EnableBuffering();

            using (var reader = new StreamReader(httpRequest.Body, leaveOpen: true))
            {
                var body = await reader.ReadToEndAsync();
                httpRequest.Body.Position = 0;

                try
                {
                    var jsonBody = JsonDocument.Parse(body);

                    if (!jsonBody.RootElement.TryGetProperty(UserIdPropertyName, out var userIdFromBody) || !userIdFromBody.TryGetInt32(out var bodyUserId))
                    {
                        context.Result = new BadRequestObjectResult($"The request body must contain a property '{UserIdPropertyName}' with a valid integer value.");
                        return;
                    }

                    if (userId != bodyUserId)
                    {
                        context.Result = new ForbidResult();
                    }
                }
                catch (JsonException)
                {
                    context.Result = new BadRequestObjectResult("Invalid JSON in the request body.");
                }
            }
        }
    }
}

