 namespace Api.Dtos;

public class BidDto
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime CreatedAt { get; set; }
        public int AuctionId { get; set; }
        public int UserId { get; set; }
    }
