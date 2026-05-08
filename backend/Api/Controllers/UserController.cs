using Microsoft.AspNetCore.Mvc;
using Api.Data;
using Api.Models;
using Api.Dtos;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly AppDbContext _context;

    public UserController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetUsers()
    {
        var users = _context.Users
            .Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email
            })
            .ToList();

        return Ok(users);
    }

    [HttpGet("{id}")]
    public IActionResult GetUser(int id)
    {
        var user = _context.Users
            .Where(u => u.Id == id)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email
            })
            .FirstOrDefault();

        if (user == null)
            return NotFound();

        return Ok(user);
    }

    [HttpPost]
    public IActionResult CreateUser(CreateUserDto dto)
    {
        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            Password = dto.Password
        };

        _context.Users.Add(user);
        _context.SaveChanges();

        return Ok(new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email
        });
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteUser(int id)
    {
        var user = _context.Users.Find(id);

        if (user == null)
            return NotFound();

        _context.Users.Remove(user);
        _context.SaveChanges();

        return NoContent();
    }
}