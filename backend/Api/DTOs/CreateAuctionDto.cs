using System.ComponentModel.DataAnnotations;
namespace Api.Dtos;

public class CreateAuctionDto
{
    [Required]
    [MaxLength(100)]
    public string Title { get; set; }


    [Required]
    [MaxLength(500)]
    public string Description { get; set; }

    [Range(1,10000000)]
    public decimal Price { get; set; }

        
    public DateTime StartDate { get; set; }
    
    
    public DateTime EndDate { get; set; }
    
    
    public int UserId { get; set; }
}