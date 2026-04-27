namespace SingalR_Exploration.DTOs
{
    public class MessageDTO
    {
        public string User { get; set; } = null!;
        public string Text { get; set; } = null!;
        public string? Avatar { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}