

using System.ComponentModel.DataAnnotations;
namespace Api.Dtos;

public class CreateUserDto
{
    [Required]
    [MaxLength(50)]
    public string Username { get; set; }
    
    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    [MinLength(4)]
    public string Password { get; set; }
}