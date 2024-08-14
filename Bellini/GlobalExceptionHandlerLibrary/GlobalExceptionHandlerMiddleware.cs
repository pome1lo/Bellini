using BusinessLogic.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using System.Net;
using System.Text.Json;

namespace GlobalExceptionHandlerLibrary
{
    public class GlobalExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;

        public GlobalExceptionHandlerMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                var statusCode = HttpStatusCode.InternalServerError;
                var errorCode = "InternalServerError";

                if (ex is ArgumentException)
                {
                    statusCode = HttpStatusCode.BadRequest;
                    errorCode = "BadRequest";
                } 
                else if (ex is NotFoundException)
                {
                    statusCode = HttpStatusCode.NotFound;
                    errorCode = "NotFound";
                }
                else if (ex is RepeatingNameException)
                {
                    statusCode = HttpStatusCode.Conflict;
                    errorCode = "RepeatingName";
                }
                else if (ex is UnauthorizedAccessException)
                {
                    statusCode = HttpStatusCode.Unauthorized;
                    errorCode = "Unauthorized";
                }
                else if (ex is SecurityTokenException)
                {
                    statusCode = HttpStatusCode.Unauthorized;
                    errorCode = "Unauthorized";
                }

                context.Response.StatusCode = (int)statusCode;
                context.Response.ContentType = "application/json";

                var errorResponse = new
                {
                    Message = ex.Message,
                    ErrorCode = errorCode
                };

                var result = JsonSerializer.Serialize(errorResponse);
                await context.Response.WriteAsync(result);
            }
        }
    }
}
