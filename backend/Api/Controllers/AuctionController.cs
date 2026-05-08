
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Models;
using Api.Dtos;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class  AuctionController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuctionController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetAuctions()
    {
        var auctions = _context.Auctions
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
            .ToList();

        return Ok(auctions);
    }

    [HttpGet("{id}")]
    public IActionResult GetAuction(int id)
    {
        var auction = _context.Auctions
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
            .FirstOrDefault();

        if (auction == null)
            return NotFound();

        return Ok(auction);
    }

    [HttpPost]
    public IActionResult CreateAuction(CreateAuctionDto dto)
    {
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
        _context.SaveChanges();

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
     public IActionResult DeleteAuction(int id)
    {
        var auction = _context.Auctions.Find(id);
        if (auction == null)
        {
            return NotFound();
        }
        _context.Auctions.Remove(auction);
        _context.SaveChanges();
        return NoContent();
    }

}


