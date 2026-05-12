using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Models;
using Api.Dtos;

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
            .Select(a => new AuctionDto
            {
                Id = a.Id,
                Title = a.Title,
                Description = a.Description,
                Price = a.Price,
                StartDate = a.StartDate,
                EndDate = a.EndDate,
                UserId = a.UserId
            })
            .ToListAsync();

        return Ok(auctions);
    }

    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetAuction(int id)
    {
        var auction = await _context.Auctions
            .Where(a => a.Id == id)
            .Select(a => new AuctionDto
            {
                Id = a.Id,
                Title = a.Title,
                Description = a.Description,
                Price = a.Price,
                StartDate = a.StartDate,
                EndDate = a.EndDate,
                UserId = a.UserId
            })
            .FirstOrDefaultAsync();

        if (auction == null)
            return NotFound();

        return Ok(auction);
    }

   
    [HttpPost]
    public async Task<IActionResult> CreateAuction(CreateAuctionDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        
        var user = await _context.Users.FindAsync(dto.UserId);
        if (user == null)
            return BadRequest("User not found.");

        
        if (dto.EndDate <= dto.StartDate)
            return BadRequest("EndDate must be after StartDate.");

        var auction = new Auction
        {
            Title = dto.Title,
            Description = dto.Description,
            Price = dto.Price,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            UserId = dto.UserId
        };

        _context.Auctions.Add(auction);
        await _context.SaveChangesAsync();

        return Ok(new AuctionDto
        {
            Id = auction.Id,
            Title = auction.Title,
            Description = auction.Description,
            Price = auction.Price,
            StartDate = auction.StartDate,
            EndDate = auction.EndDate,
            UserId = auction.UserId
        });
    }

    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAuction(int id)
    {
        var auction = await _context.Auctions.FindAsync(id);

        if (auction == null)
            return NotFound();

        _context.Auctions.Remove(auction);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}