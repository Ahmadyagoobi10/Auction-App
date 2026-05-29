using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Api.Data;
using Api.Models;
using Api.Dtos;
using Api.Services;
using System.Security.Cryptography;
using System.Text;
using Api.Dtos.Auth;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly JwtService _jwt;

    public UserController(AppDbContext context, JwtService jwt)
    {
        _context = context;
        _jwt = jwt;
    }

    
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users
            .Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email
            })
            .ToListAsync();

        return Ok(users);
    }

    
    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(int id)
    {
        var user = await _context.Users
            .Where(u => u.Id == id)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email
            })
            .FirstOrDefaultAsync();

        if (user == null)
            return NotFound();

        return Ok(user);
    }

    
    [HttpPost]
    public async Task<IActionResult> CreateUser(CreateUserDto dto)
    {
        var hashedPassword = HashPassword(dto.Password);

        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            Password = hashedPassword
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email
        });
    }

    
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null || !VerifyPassword(dto.Password, user.Password))
            return Unauthorized("Invalid email or password");

        var token = _jwt.GenerateToken(user);

        return Ok(new { token });
    }

    
    [Authorize]
    [HttpPut("password")]
    public async Task<IActionResult> UpdatePassword(UpdatePasswordDto dto)
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);

        var user = await _context.Users.FindAsync(userId);

        if (user == null)
            return NotFound();

        if (!VerifyPassword(dto.OldPassword, user.Password))
            return BadRequest("Wrong password");

        user.Password = HashPassword(dto.NewPassword);

        await _context.SaveChangesAsync();

        return Ok("Password updated");
    }

    
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return NotFound();

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    
    private string HashPassword(string password)
    {
        using var sha = SHA256.Create();
        var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(bytes);
    }

    private bool VerifyPassword(string input, string hashed)
    {
        return HashPassword(input) == hashed;
    }
}