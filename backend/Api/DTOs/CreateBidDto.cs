using System.ComponentModel.DataAnnotations;
namespace Api.Dtos;

public class CreateBidDto
{
    [Range(1, 10000000)]
    public decimal Amount { get; set; }

    public int AuctionId { get; set; }
    
    public int UserId { get; set; }
}