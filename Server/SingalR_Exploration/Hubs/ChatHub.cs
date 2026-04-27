using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SignalR_Exploration.Data;
using SignalR_Exploration.Models;
using SingalR_Exploration.DTOs;
using System.Collections.Concurrent;

namespace SingalR_Exploration.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private static ConcurrentDictionary<string, string> _users = new();
        private readonly AppDbContext _db;

        public ChatHub(AppDbContext db)
        {
            _db = db;
        }

        public override async Task OnConnectedAsync()
        {
            var user = Context.User.Identity?.Name!;

            _users[Context.ConnectionId] = user;

            await Clients.All.SendAsync("UsersUpdated", _users.Values.ToList());

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            _users.TryRemove(Context.ConnectionId, out _);

            await Clients.All.SendAsync("UsersUpdated", _users.Values.ToList());

            await base.OnDisconnectedAsync(exception);
        }

        public async Task JoinRoom(string roomName)
        {
            if (string.IsNullOrWhiteSpace(roomName))
                return;

            var user = Context.User?.Identity?.Name ?? "Anonymous";

            await Groups.AddToGroupAsync(Context.ConnectionId, roomName);

            await Clients.OthersInGroup(roomName)
                .SendAsync("ReceiveRoomMessage", new MessageDTO
                {
                    User = "System",
                    Text = $"{user} joined",
                    CreatedAt = DateTime.UtcNow
                });
        }

        public async Task SendRoomMessage(string roomName, string message)
        {
            if (string.IsNullOrWhiteSpace(message) || message.Length > 300)
                return;

            var currentUser = Context.User?.Identity?.Name ?? "Anonymous";

            var msg = new Message
            {
                Sender = currentUser,
                Room = roomName,
                Text = message,
                Type = MessageType.Room
            };

            _db.Messages.Add(msg);
            await _db.SaveChangesAsync();

            await Clients.Group(roomName)
                .SendAsync("ReceiveRoomMessage", new MessageDTO
                {
                    User = currentUser,
                    Text = message,
                    CreatedAt = msg.CreatedAt
                });
        }

        public async Task LoadRoomHistory(string roomName)
        {
            var messages = (await _db.Messages
                .AsNoTracking()
                .Where(m => m.Room == roomName)
                .OrderByDescending(m => m.CreatedAt)
                .Take(50)
                .ToListAsync())
                .OrderBy(m => m.CreatedAt)
                .ToList();

            var result = messages.Select(m => new MessageDTO
            {
                User = m.Sender,
                Text = m.Text,
                CreatedAt = m.CreatedAt
            });

            await Clients.Caller.SendAsync("LoadMessages", result);
        }
    }
}