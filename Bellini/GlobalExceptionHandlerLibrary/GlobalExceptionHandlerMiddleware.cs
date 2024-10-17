using BusinessLogic.Exceptions;
using BusinessLogicLayer.Exceptions;
using FluentValidation;
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
                Console.BackgroundColor = ConsoleColor.Red;
                Console.WriteLine(ex.Message);
                Console.BackgroundColor = ConsoleColor.Black;


                var statusCode = HttpStatusCode.InternalServerError;
                var errorCode = "InternalServerError";
                if (ex is IncorrectNumberOfAnswersException)
                {
                    statusCode = HttpStatusCode.BadRequest;
                    errorCode = "IncorrectNumberOfAnswersException";
                }
                if (ex is NotFoundGameQuestionsException)
                {
                    statusCode = HttpStatusCode.BadRequest;
                    errorCode = "NotFoundGameQuestionsException";
                }
                else if (ex is ArgumentException)
                {
                    statusCode = HttpStatusCode.BadRequest;
                    errorCode = "ArgumentException";
                }
                else if (ex is NotFoundException)
                {
                    statusCode = HttpStatusCode.NotFound;
                    errorCode = "NotFoundException";
                }
                else if (ex is RepeatingNameException)
                {
                    statusCode = HttpStatusCode.Conflict;
                    errorCode = "RepeatingNameException";
                }
                else if (ex is UnauthorizedAccessException)
                {
                    statusCode = HttpStatusCode.Unauthorized;
                    errorCode = "UnauthorizedAccessException";
                }
                else if (ex is SecurityTokenException)
                {
                    statusCode = HttpStatusCode.Unauthorized;
                    errorCode = "SecurityTokenException";
                }
                else if (ex is ValidationException)
                {
                    statusCode = HttpStatusCode.BadRequest;
                    errorCode = "ValidationException";
                }
                else if (ex is NoContentException)
                {
                    statusCode = HttpStatusCode.NoContent;
                    errorCode = "NoContentException";
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
