using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using SignalR_Exploration.Data;
using SignalR_Exploration.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SignalR_Exploration.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _config;
        private readonly PasswordHasher<User> _hasher;

        public AuthController(AppDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
            _hasher = new PasswordHasher<User>();
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(AuthRequest request)
        {
            var username = request.Username.Trim();

            if (await _db.Users.AnyAsync(u => u.Username == username))
                return BadRequest("User already exists");

            var user = new User { Username = username };

            user.PasswordHash = _hasher.HashPassword(user, request.Password);

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(AuthRequest request)
        {
            var user = await _db.Users
                .FirstOrDefaultAsync(u => u.Username == request.Username);

            if (user == null)
                return Unauthorized();

            var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);

            if (result == PasswordVerificationResult.Failed)
                return Unauthorized();

            var token = GenerateToken(user);

            return Ok(new { token, username = user.Username }); // 👈 useful for frontend
        }

        private string GenerateToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds,
                notBefore: DateTime.UtcNow
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class AuthRequest
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}