using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Models;
using Api.Dtos;

namespace Api.Controllers;

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
    public IActionResult GetBids()
    {
        var bids = _context.Bids
            .Select(b => new BidDto
            {
                Id = b.Id,
                Amount = b.Amount,
                CreatedAt = b.CreatedAt,
                AuctionId = b.AuctionId,
                UserId = b.UserId
            })
            .ToList();

        return Ok(bids);
    }

   
    [HttpGet("{id}")]
    public IActionResult GetBid(int id)
    {
        var bid = _context.Bids
            .Where(b => b.Id == id)
            .Select(b => new BidDto
            {
                Id = b.Id,
                Amount = b.Amount,
                CreatedAt = b.CreatedAt,
                AuctionId = b.AuctionId,
                UserId = b.UserId
            })
            .FirstOrDefault();

        if (bid == null)
            return NotFound();

        return Ok(bid);
    }

    
    [HttpPost]
    public IActionResult CreateBid(CreateBidDto dto)
    {
        var bid = new Bid
        {
            Amount = dto.Amount,
            CreatedAt = DateTime.UtcNow,
            AuctionId = dto.AuctionId,
            UserId = dto.UserId
        };

        _context.Bids.Add(bid);
        _context.SaveChanges();

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
    public IActionResult DeleteBid(int id)
    {
        var bid = _context.Bids.Find(id);

        if (bid == null)
            return NotFound();

        _context.Bids.Remove(bid);
        _context.SaveChanges();

        return NoContent();
    }
}