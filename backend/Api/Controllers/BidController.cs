using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Models;
using Api.Dtos;
using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;
using Api.Hubs;

namespace Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class BidController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IHubContext<AuctionHub> _hub;

    public BidController(AppDbContext context, IHubContext<AuctionHub> hub)
    {
        _context = context;
        _hub = hub;
    }

    [HttpGet]
    public async Task<IActionResult> GetBids()
    {
        var bids = await _context.Bids
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
        var bid = await _context.Bids
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
            return NotFound(new { message = "Bid not found" });

        return Ok(bid);
    }

     [HttpPost]
public async Task<IActionResult> CreateBid(CreateBidDto dto)
{
    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    if (string.IsNullOrEmpty(userIdClaim))
        return Unauthorized(new { message = "User not authenticated" });

    int userId = int.Parse(userIdClaim);

    var auction = await _context.Auctions
        .FirstOrDefaultAsync(a => a.Id == dto.AuctionId);

    if (auction == null)
        return BadRequest(new { message = "Auction not found" });

    if (auction.UserId == userId)
        return BadRequest(new { message = "You cannot bid on your own auction" });

    if (auction.EndDate <= DateTime.UtcNow)
        return BadRequest(new { message = "Auction has ended" });

    if (dto.Amount <= auction.Price)
        return BadRequest(new { message = "Bud måste vara högre än aktuell pris" });

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

    return Ok(new
    {
        message = "Bid placed successfully",
        bid = new BidDto
        {
            Id = bid.Id,
            Amount = bid.Amount,
            CreatedAt = bid.CreatedAt,
            AuctionId = bid.AuctionId,
            UserId = bid.UserId
        }
    });
 }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBid(int id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim))
            return Unauthorized();

        int userId = int.Parse(userIdClaim);

        var bid = await _context.Bids
            .Include(b => b.Auction)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (bid == null)
            return NotFound(new { message = "Bid not found" });

        
        if (bid.Auction== null)
            return BadRequest(new { message = "Auction missing" });

        
        var latestBid = await _context.Bids
            .Where(b => b.AuctionId == bid.AuctionId)
            .OrderByDescending(b => b.CreatedAt)
            .FirstOrDefaultAsync();

        if (latestBid == null || latestBid.Id != id)
            return BadRequest(new { message = "Only latest bid can be deleted" });

       
        if (bid.UserId != userId)
            return Forbid();

        _context.Bids.Remove(bid);

        
        var previousBid = await _context.Bids
            .Where(b => b.AuctionId == bid.AuctionId)
            .OrderByDescending(b => b.CreatedAt)
            .FirstOrDefaultAsync();

        if (previousBid != null)
            bid.Auction.Price = previousBid.Amount;
        else
            bid.Auction.Price = 0;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Bid deleted successfully" });
    }
}