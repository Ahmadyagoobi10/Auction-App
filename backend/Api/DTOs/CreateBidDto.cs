namespace Api.Dtos;

public class CreateBidDto
{
    public decimal Amount { get; set; }

    public int AuctionId { get; set; }
    public int UserId { get; set; }
}