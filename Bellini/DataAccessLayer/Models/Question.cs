﻿using System.Text.Json.Serialization;

namespace DataAccessLayer.Models
{
    public class Question : BaseModel
    {
        public int Id { get; set; }
        public string Text { get; set; } = null!;
        public int GameId { get; set; }
        [JsonIgnore] public Game Game { get; set; } = null!;
        public bool IsCustom { get; set; }
        public List<AnswerOption> AnswerOptions { get; set; } = new List<AnswerOption>();
    }
}
