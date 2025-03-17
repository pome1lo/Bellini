using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Data.Seeds
{
    internal class GameSeedData
    {
        public static void Seed(ModelBuilder modelBuilder)
        {
            var host =
            //    "/apigateway"
                "https://localhost:7292"
            ;

            var games = new List<Game>();

            var publicGameNames = new[]
             {
                "Тайны древнего храма", "Гонка за артефактом", "Побег из подземелья", "Магический поединок",
                "Королевская битва", "Космическое приключение", "Выживание в пустыне", "Пиратские тайны",
                "Зомби-апокалипсис", "Миссия на Марс"
            };

            var privateGameNames = new[]
            {
                "Осада замка", "Подводная экспедиция", "Шпионские интриги", "Операция: Побег",
                "Джунгли Амазонки", "Космический рейнджер", "Дикий Запад", "Средневековые войны",
                "Рыцарский турнир", "Выживание в Арктике"
            };

            var completedGameNames = new[]
            {
                "Последняя битва", "Финальная миссия", "Освобождение города", "Падение империи",
                "Затерянные миры", "Код красный", "Тень прошлого", "Битва за будущее",
                "Последний шанс", "Взрывное противостояние"
            };

            for (int i = 1; i <= 10; i++)
            {
                games.Add(new Game
                {
                    Id = i,
                    GameName = publicGameNames[i - 1],
                    HostId = 1,
                    MaxPlayers = 4 + (i % 7),
                    GameStatusId = 1,
                    GameCoverImageUrl = $"{host}/question/default/{i}.jpg",
                    IsPrivate = false,
                    RoomPassword = ""
                });
            }

            for (int i = 11; i <= 20; i++)
            {
                games.Add(new Game
                {
                    Id = i,
                    GameName = privateGameNames[i - 11],
                    HostId = 1,
                    MaxPlayers = 4 + (i % 7),
                    GameStatusId = 1,
                    GameCoverImageUrl = $"{host}/question/default/{i}.jpg",
                    IsPrivate = true,
                    RoomPassword = "password"
                });
            }

            for (int i = 21; i <= 30; i++)
            {
                games.Add(new Game
                {
                    Id = i,
                    GameName = completedGameNames[i - 21],
                    HostId = 1,
                    MaxPlayers = 4 + (i % 7),
                    GameStatusId = 3,
                    GameCoverImageUrl = $"{host}/question/default/{i}.jpg",
                    IsPrivate = false,
                    RoomPassword = ""
                });
            }

            modelBuilder.Entity<Game>().HasData(games);
        }
    }
}
