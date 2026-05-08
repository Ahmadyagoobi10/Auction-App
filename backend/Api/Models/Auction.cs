using Microsoft.EntityFrameworkCore;

namespace Api.Models;

public class Auction
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }

    [Precision(18, 2)]
    public decimal Price { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    public int UserId { get; set; }

    public User? User { get; set; }

    public List<Bid> Bids { get; set; } = new();
}