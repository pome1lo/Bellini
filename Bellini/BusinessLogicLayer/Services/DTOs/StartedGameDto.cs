﻿using DataAccessLayer.Models;

namespace BusinessLogicLayer.Services.DTOs
{
    public class StartedGameDto
    {
        public int Id { get; set; }
        public string GameName { get; set; } = null!;
        public int HostId { get; set; }
        public DateTime CreateTime { get; set; } = DateTime.Now;
        public DateTime StartTime { get; set; } = DateTime.MinValue;
        public int MaxPlayers { get; set; }
        public string GameCoverImageUrl { get; set; } = null!;
        public List<Player> Players { get; set; } = null!;
        public List<GameQuestion> Questions { get; set; } = null!;

        public StartedGameDto(Game game)
        {
            this.Id = game.Id;
            this.Players = game.Players;
            this.Questions = game.Questions;
            this.StartTime = game.StartTime;
            this.CreateTime = game.CreateTime;
            this.GameCoverImageUrl = game.GameCoverImageUrl;
            this.MaxPlayers = game.MaxPlayers;
            this.GameName = game.GameName;
            this.HostId = game.HostId;
        }
    }
}
