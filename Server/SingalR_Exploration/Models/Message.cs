namespace SignalR_Exploration.Models
{
    public enum MessageType
    {
        Room,
        Private
    }

    public class Message
    {
        public int Id { get; set; }

        public string Sender { get; set; } = null!;
        public string? Receiver { get; set; }
        public string? Room { get; set; }

        public MessageType Type { get; set; }

        public string Text { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}