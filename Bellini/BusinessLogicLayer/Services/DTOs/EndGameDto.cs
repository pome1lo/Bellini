﻿using DataAccessLayer.Models;
using System.Text.Json.Serialization;

namespace BusinessLogicLayer.Services.DTOs
{
    public class EndGameDto
    {
        public string GameName { get; set; } = null!;
        public int HostId { get; set; }
        public DateTime CreateTime { get; set; } = DateTime.Now;
        public DateTime StartTime { get; set; } = DateTime.MinValue;
        public DateTime EndTime { get; set; } = DateTime.MinValue;
        public int MaxPlayers { get; set; }
        public string GameCoverImageUrl { get; set; } = null!;
        public bool IsPrivate { get; set; }
        public string RoomPassword { get; set; } = "";
        public int GameStatusId { get; set; }

        [JsonIgnore] public GameStatus Status { get; set; } = null!;
        [JsonIgnore] public List<GameComment> Comments { get; set; } = null!;
        [JsonIgnore] public List<Player> Players { get; set; } = null!;
        [JsonIgnore] public List<GameQuestion> Questions { get; set; } = null!;
    }
}
