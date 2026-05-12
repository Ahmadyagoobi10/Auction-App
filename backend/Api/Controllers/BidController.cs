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
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var auction = await _context.Auctions.FindAsync(dto.AuctionId);
        if (auction == null)
        {
            return BadRequest("Auction not found.");
        }

        var user = await _context.Users.FindAsync(dto.UserId);
        if (user == null)
        {
            return BadRequest("User not found.");
        }

        if (dto.Amount <= auction.Price)
        {
            return BadRequest("Bid amount must be higher than the current price.");
        } 

        if(auction.EndDate<= DateTime.UtcNow)
        {
            return BadRequest("Auction has already ended.");
        }

        var bid = new Bid
        {
            Amount = dto.Amount,
            CreatedAt = DateTime.UtcNow,
            AuctionId = dto.AuctionId,
            UserId = dto.UserId
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