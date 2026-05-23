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
public class BidController : ControllerBase
{
    private readonly AppDbContext _context;

    public BidController(AppDbContext context)
    {
        _context = context;
    }

    
    [HttpGet]
    public async Task<IActionResult> GetBids()
    {
        var bids = await    _context.Bids
            .Select(b => new BidDto
            {
                Id = b.Id,
                Amount = b.Amount,
                CreatedAt = b.CreatedAt,
                AuctionId = b.AuctionId,
                UserId = b.UserId
            })
            .ToListAsync();
        return Ok(bids);
    }

   
    [HttpGet("{id}")]
    public async Task<IActionResult> GetBid(int id)
    {
        var bid = await  _context.Bids
            .Where(b => b.Id == id)
            .Select(b => new BidDto
            {
                Id = b.Id,
                Amount = b.Amount,
                CreatedAt = b.CreatedAt,
                AuctionId = b.AuctionId,
                UserId = b.UserId
            })
            .FirstOrDefaultAsync();

        if (bid == null)
            return NotFound();

        return Ok(bid);
    }

    [HttpPost]
    public async Task<IActionResult> CreateBid(CreateBidDto dto)
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);

        var auction = await _context.Auctions.FindAsync(dto.AuctionId);
        if (auction == null)
            return BadRequest("Auction not found.");

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return BadRequest("User not found.");

        if (dto.Amount <= auction.Price)
            return BadRequest("Bid must be higher than current price.");

        if (auction.EndDate <= DateTime.UtcNow)
            return BadRequest("Auction has ended.");

        var bid = new Bid
        {
            Amount = dto.Amount,
            CreatedAt = DateTime.UtcNow,
            AuctionId = dto.AuctionId,
            UserId = userId
        };

        _context.Bids.Add(bid);
        auction.Price = dto.Amount;

        await _context.SaveChangesAsync();

        return Ok(new BidDto
        {
            Id = bid.Id,
            Amount = bid.Amount,
            CreatedAt = bid.CreatedAt,
            AuctionId = bid.AuctionId,
            UserId = bid.UserId
        });
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBid(int id)
    {
        var bid = await _context.Bids.FindAsync(id);

        if (bid == null)
            return NotFound();

        _context.Bids.Remove(bid);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}