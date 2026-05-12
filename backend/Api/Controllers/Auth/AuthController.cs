using Microsoft.AspNetCore.Mvc;
using Api.Data;
using Api.Models;
using Api.Dtos.Auth;
using Api.Services;

namespace Api.Controllers.Auth;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly JwtService _jwt;

    public AuthController(AppDbContext context, JwtService jwt)
    {
        _context = context;
        _jwt = jwt;
    }

    [HttpPost("register")]
    public IActionResult Register(RegisterDto dto)
    {
        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            Password = dto.Password
        };

        _context.Users.Add(user);
        _context.SaveChanges();

        var token = _jwt.GenerateToken(user);
        return Ok(new 
        { 
            token = token 
        
        }); 
    }

    [HttpPost("login")]
    public IActionResult Login(LoginDto dto)
    {
        var user = _context.Users
            .FirstOrDefault(u => u.Email == dto.Email && u.Password == dto.Password);

        if (user == null)
            return Unauthorized("Invalid login");

        var token = _jwt.GenerateToken(user);

        return Ok(new 
        { 
            token = token 
        
        });
    }
}