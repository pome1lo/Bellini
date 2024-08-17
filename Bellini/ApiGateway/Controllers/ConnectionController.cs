using Microsoft.AspNetCore.Mvc;

namespace AuthenticationService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ConnectionController : ControllerBase
    {
        [HttpGet]
        public IActionResult Test()
        {
            return Ok(
                "Connection successful"
            );
        }
    }
}
