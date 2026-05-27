using Microsoft.EntityFrameworkCore;

namespace Api.Models;

public class Bid
{
    public int Id { get; set; }

    [Precision(18, 2)]
    public decimal Amount { get; set; }
    public DateTime CreatedAt { get; set; }

    public int AuctionId { get; set; }
    
    public Auction? Auction { get; set; } = null;
    
    public int UserId { get; set; }

    public User? User { get; set; } = null;
}