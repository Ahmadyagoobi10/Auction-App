using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Models;
using Api.Dtos;
using System.Security.Claims;

namespace Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AuctionController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuctionController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAuctions()
    {
        var auctions = await _context.Auctions
            .AsNoTracking()
            .ToListAsync();

        return Ok(auctions.Select(a => new AuctionDto
        {
            Id = a.Id,
            Title = a.Title,
            Description = a.Description,
            Price = a.Price,
            StartDate = a.StartDate,
            EndDate = a.EndDate,
            UserId = a.UserId,
            Images = a.Images ?? new List<string>()   
        }));
    }

    [HttpPost]
    public async Task<IActionResult> CreateAuction(CreateAuctionDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userIdClaim == null)
            return Unauthorized();

        var userId = int.Parse(userIdClaim);

        var auction = new Auction
        {
            Title = dto.Title,
            Description = dto.Description,
            Price = dto.Price,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            UserId = userId,
            Images = dto.Images ?? new List<string>()  
        };

        _context.Auctions.Add(auction);
        await _context.SaveChangesAsync();

        return Ok(auction);
    }
}