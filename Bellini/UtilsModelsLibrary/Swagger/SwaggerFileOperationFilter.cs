using Microsoft.AspNetCore.Http;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace UtilsModelsLibrary.Swagger
{
    public class SwaggerFileOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            // Если в параметрах запроса есть IFormFile, добавляем поддержку multipart/form-data
            if (operation.RequestBody != null && context.ApiDescription.ParameterDescriptions.Any(p => p.Type == typeof(IFormFile)))
            {
                // Добавляем описание для multipart/form-data
                operation.RequestBody.Content["multipart/form-data"] = new OpenApiMediaType
                {
                    Schema = new OpenApiSchema
                    {
                        Type = "object",
                        Properties =
                        {
                            ["profileImage"] = new OpenApiSchema
                            {
                                Type = "string",
                                Format = "binary"
                            },
                            ["updateProfileDto"] = new OpenApiSchema
                            {
                                Type = "object",
                                Properties =
                                {
                                    ["firstName"] = new OpenApiSchema { Type = "string" },
                                    ["lastName"] = new OpenApiSchema { Type = "string" },
                                    ["profileImageUrl"] = new OpenApiSchema { Type = "string" }
                                }
                            }
                        }
                    }
                };
            }
        }
    }

}
