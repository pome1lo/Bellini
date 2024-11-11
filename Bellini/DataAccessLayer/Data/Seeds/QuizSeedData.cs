using DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Data.Seeds
{
    internal class QuizSeedData
    {
        public static void Seed(ModelBuilder modelBuilder)
        {
            var defaultQuizzes = new List<Quiz>
            {
                new Quiz
                {
                    Id = 1,
                    GameName = "Мифология Древней Греции",
                    GameCoverImageUrl = "https://i.pinimg.com/originals/b3/7e/4f/b37e4fd167bd9e14558dd14301ec6487.jpg",
                    StartTime = DateTime.MinValue,
                    EndTime = DateTime.MinValue,
                },
                new Quiz
                {
                    Id = 2,
                    GameName = "Древний Рим",
                    GameCoverImageUrl = "https://i.pinimg.com/originals/b3/7e/4f/b37e4fd167bd9e14558dd14301ec6487.jpg",
                    StartTime = DateTime.MinValue,
                    EndTime = DateTime.MinValue
                },
                new Quiz
                {
                    Id = 3,
                    GameName = "Современные технологии",
                    GameCoverImageUrl = "https://example.com/tech.jpg",
                    StartTime = DateTime.MinValue,
                    EndTime = DateTime.MinValue
                }
            };

            modelBuilder.Entity<Quiz>().HasData(defaultQuizzes);

            var questions = new List<QuizQuestion>
            {
                new QuizQuestion { Id = 1,  Text = "Кто был верховным богом в греческой мифологии?", QuizId = 1, },
                new QuizQuestion { Id = 2,  Text = "Какой бог был покровителем кузнецов и огня?", QuizId = 1,},
                new QuizQuestion { Id = 3,  Text = "Кто был богом моря?", QuizId = 1, },
                new QuizQuestion { Id = 4,  Text = "Кто был богиней мудрости?",QuizId = 1,},
                new QuizQuestion { Id = 5,  Text = "Кто был богом войны?",QuizId = 1,},
                new QuizQuestion { Id = 6,  Text = "Кто был богиней охоты?",QuizId = 1,},
                new QuizQuestion { Id = 7,  Text = "Кто был вестником богов?",QuizId = 1,},
                new QuizQuestion { Id = 8,  Text = "Кто был богом солнца?",QuizId = 1,                },
                new QuizQuestion { Id = 9,  Text = "Кто был богиней любви и красоты?",QuizId = 1,},
                new QuizQuestion { Id = 10, Text = "Кто был титаном, держащим небо на своих плечах?",QuizId = 1,},

                new QuizQuestion { Id = 11, Text = "Кто был основателем Рима?", QuizId = 2 },
                new QuizQuestion { Id = 12, Text = "Какой был последний император Рима?", QuizId = 2 },
                new QuizQuestion { Id = 13, Text = "Какой бог был покровителем Рима?", QuizId = 2 },
                new QuizQuestion { Id = 14, Text = "Какой праздник был посвящен славе императоров?", QuizId = 2 },
                new QuizQuestion { Id = 15, Text = "Кто был великим полководцем Рима?", QuizId = 2 },
                new QuizQuestion { Id = 16, Text = "Какое здание является символом Рима?", QuizId = 2 },
                new QuizQuestion { Id = 17, Text = "Какой язык был официальным в Риме?", QuizId = 2 },
                new QuizQuestion { Id = 18, Text = "Какое искусство было популярно в Риме?", QuizId = 2 },
                new QuizQuestion { Id = 19, Text = "Какой строй был установлен в Риме?", QuizId = 2 },
                new QuizQuestion { Id = 20, Text = "Какой век считается временем расцвета Рима?", QuizId = 2 }

                new QuizQuestion { Id = 22, Text = "Какой сервис используется для хранения проектов с контролем версий?", QuizId = 3 },
                new QuizQuestion { Id = 23, Text = "Какая компания разработала язык Swift?", QuizId = 3 },
                new QuizQuestion { Id = 24, Text = "Какой язык программирования чаще всего используется для веб-разработки на серверной стороне?", QuizId = 3 },
                new QuizQuestion { Id = 25, Text = "Какая система управления базами данных является популярной для больших данных?", QuizId = 3 },
                new QuizQuestion { Id = 26, Text = "Какой протокол используется для защиты данных при передаче в интернете?", QuizId = 3 },
                new QuizQuestion { Id = 27, Text = "Как называется популярный фреймворк для фронтенд-разработки от Facebook?", QuizId = 3 },
                new QuizQuestion { Id = 28, Text = "Какой язык программирования чаще всего используется для создания машинного обучения?", QuizId = 3 },
                new QuizQuestion { Id = 29, Text = "Какой текстовый редактор стал популярным благодаря расширяемости и множеству плагинов?", QuizId = 3 },
                new QuizQuestion { Id = 30, Text = "Как называется формат обмена данными, основанный на ключ-значение и часто используемый в API?", QuizId = 3 }
            };

            modelBuilder.Entity<QuizQuestion>().HasData(questions);

            var answerOptions = new List<QuizAnswerOption>
            {
                // Вопрос 1
                new QuizAnswerOption { Id = 1, Text = "Посейдон", IsCorrect = false, QuizQuestionId = 1 },
                new QuizAnswerOption { Id = 2, Text = "Геракл", IsCorrect = false, QuizQuestionId = 1 },
                new QuizAnswerOption { Id = 3, Text = "Зевс", IsCorrect = true, QuizQuestionId = 1 },
                new QuizAnswerOption { Id = 4, Text = "Аполлон", IsCorrect = false, QuizQuestionId = 1 },
        
                // Вопрос 2
                new QuizAnswerOption { Id = 5, Text = "Арес", IsCorrect = false, QuizQuestionId = 2 },
                new QuizAnswerOption { Id = 6, Text = "Гефест", IsCorrect = true, QuizQuestionId = 2 },
                new QuizAnswerOption { Id = 7, Text = "Аполлон", IsCorrect = false, QuizQuestionId = 2 },
                new QuizAnswerOption { Id = 8, Text = "Зевс", IsCorrect = false, QuizQuestionId = 2 },

                // Вопрос 3
                new QuizAnswerOption { Id = 9, Text = "Гермес", IsCorrect = false, QuizQuestionId = 3 },
                new QuizAnswerOption { Id = 10, Text = "Посейдон", IsCorrect = true, QuizQuestionId = 3 },
                new QuizAnswerOption { Id = 11, Text = "Дионис", IsCorrect = false, QuizQuestionId = 3 },
                new QuizAnswerOption { Id = 12, Text = "Афина", IsCorrect = false, QuizQuestionId = 3 },

                // Вопрос 4
                new QuizAnswerOption { Id = 13, Text = "Гера", IsCorrect = false, QuizQuestionId = 4 },
                new QuizAnswerOption { Id = 14, Text = "Афина", IsCorrect = true, QuizQuestionId = 4 },
                new QuizAnswerOption { Id = 15, Text = "Артемида", IsCorrect = false, QuizQuestionId = 4 },
                new QuizAnswerOption { Id = 16, Text = "Персефона", IsCorrect = false, QuizQuestionId = 4 },

                // Вопрос 5
                new QuizAnswerOption { Id = 17, Text = "Гермес", IsCorrect = false, QuizQuestionId = 5 },
                new QuizAnswerOption { Id = 18, Text = "Арес", IsCorrect = true, QuizQuestionId = 5 },
                new QuizAnswerOption { Id = 19, Text = "Зевс", IsCorrect = false, QuizQuestionId = 5 },
                new QuizAnswerOption { Id = 20, Text = "Аполлон", IsCorrect = false, QuizQuestionId = 5 },

                // Вопрос 6
                new QuizAnswerOption { Id = 21, Text = "Гера", IsCorrect = false, QuizQuestionId = 6 },
                new QuizAnswerOption { Id = 22, Text = "Артемида", IsCorrect = true, QuizQuestionId = 6 },
                new QuizAnswerOption { Id = 23, Text = "Афродита", IsCorrect = false, QuizQuestionId = 6 },
                new QuizAnswerOption { Id = 24, Text = "Афина", IsCorrect = false, QuizQuestionId = 6 },

                // Вопрос 7
                new QuizAnswerOption { Id = 25, Text = "Гермес", IsCorrect = true, QuizQuestionId = 7 },
                new QuizAnswerOption { Id = 26, Text = "Аполлон", IsCorrect = false, QuizQuestionId = 7 },
                new QuizAnswerOption { Id = 27, Text = "Арес", IsCorrect = false, QuizQuestionId = 7 },
                new QuizAnswerOption { Id = 28, Text = "Дионис", IsCorrect = false, QuizQuestionId = 7 },

                // Вопрос 8
                new QuizAnswerOption { Id = 29, Text = "Арес", IsCorrect = false, QuizQuestionId = 8 },
                new QuizAnswerOption { Id = 30, Text = "Аполлон", IsCorrect = true, QuizQuestionId = 8 },
                new QuizAnswerOption { Id = 31, Text = "Зевс", IsCorrect = false, QuizQuestionId = 8 },
                new QuizAnswerOption { Id = 32, Text = "Гермес", IsCorrect = false, QuizQuestionId = 8 },

                // Вопрос 9
                new QuizAnswerOption { Id = 33, Text = "Афина", IsCorrect = false, QuizQuestionId = 9 },
                new QuizAnswerOption { Id = 34, Text = "Артемида", IsCorrect = false, QuizQuestionId = 9 },
                new QuizAnswerOption { Id = 35, Text = "Афродита", IsCorrect = true, QuizQuestionId = 9 },
                new QuizAnswerOption { Id = 36, Text = "Гера", IsCorrect = false, QuizQuestionId = 9 },

                // Вопрос 10
                new QuizAnswerOption { Id = 37, Text = "Кронос", IsCorrect = false, QuizQuestionId = 10 },
                new QuizAnswerOption { Id = 38, Text = "Гиперион", IsCorrect = false, QuizQuestionId = 10 },
                new QuizAnswerOption { Id = 39, Text = "Атлас", IsCorrect = true, QuizQuestionId = 10 },
                new QuizAnswerOption { Id = 40, Text = "Гигант", IsCorrect = false, QuizQuestionId = 10 },

                // Вопрос 1
                new QuizAnswerOption { Id = 41, Text = "Ромул", IsCorrect = true, QuizQuestionId = 11 },
                new QuizAnswerOption { Id = 42, Text = "Рем", IsCorrect = false, QuizQuestionId = 11 },
                new QuizAnswerOption { Id = 43, Text = "Цезарь", IsCorrect = false, QuizQuestionId = 11 },
                new QuizAnswerOption { Id = 44, Text = "Август", IsCorrect = false, QuizQuestionId = 11 },

                // Вопрос 2
                new QuizAnswerOption { Id = 45, Text = "Нерон", IsCorrect = false, QuizQuestionId = 12 },
                new QuizAnswerOption { Id = 46, Text = "Август", IsCorrect = true, QuizQuestionId = 12 },
                new QuizAnswerOption { Id = 47, Text = "Тиберий", IsCorrect = false, QuizQuestionId = 12 },
                new QuizAnswerOption { Id = 48, Text = "Клавдий", IsCorrect = false, QuizQuestionId = 12 },

                // Вопрос 3
                new QuizAnswerOption { Id = 49, Text = "Юпитер", IsCorrect = true, QuizQuestionId = 13 },
                new QuizAnswerOption { Id = 50, Text = "Марс", IsCorrect = false, QuizQuestionId = 13 },
                new QuizAnswerOption { Id = 51, Text = "Венера", IsCorrect = false, QuizQuestionId = 13 },
                new QuizAnswerOption { Id = 52, Text = "Сатурн", IsCorrect = false, QuizQuestionId = 13 },

                // Вопрос 4
                new QuizAnswerOption { Id = 53, Text = "Панем", IsCorrect = false, QuizQuestionId = 14 },
                new QuizAnswerOption { Id = 54, Text = "Луперкалии", IsCorrect = false, QuizQuestionId = 14 },
                new QuizAnswerOption { Id = 55, Text = "Тритон", IsCorrect = true, QuizQuestionId = 14 },
                new QuizAnswerOption { Id = 56, Text = "Сатурналии", IsCorrect = false, QuizQuestionId = 14 },

                // Вопрос 5
                new QuizAnswerOption { Id = 57, Text = "Ганнибал", IsCorrect = true, QuizQuestionId = 15 },
                new QuizAnswerOption { Id = 58, Text = "Цезарь", IsCorrect = false, QuizQuestionId = 15 },
                new QuizAnswerOption { Id = 59, Text = "Октавиан", IsCorrect = false, QuizQuestionId = 15 },
                new QuizAnswerOption { Id = 60, Text = "Сципион", IsCorrect = false, QuizQuestionId = 15 },

                // Вопрос 6
                new QuizAnswerOption { Id = 61, Text = "Колизей", IsCorrect = true, QuizQuestionId = 16 },
                new QuizAnswerOption { Id = 62, Text = "Пантеон", IsCorrect = false, QuizQuestionId = 16 },
                new QuizAnswerOption { Id = 63, Text = "Форум", IsCorrect = false, QuizQuestionId = 16 },
                new QuizAnswerOption { Id = 64, Text = "Кирка", IsCorrect = false, QuizQuestionId = 16 },

                // Вопрос 7
                new QuizAnswerOption { Id = 65, Text = "Латинский", IsCorrect = true, QuizQuestionId = 17 },
                new QuizAnswerOption { Id = 66, Text = "Греческий", IsCorrect = false, QuizQuestionId = 17 },
                new QuizAnswerOption { Id = 67, Text = "Еврейский", IsCorrect = false, QuizQuestionId = 17 },
                new QuizAnswerOption { Id = 68, Text = "Арабский", IsCorrect = false, QuizQuestionId = 17 },

                // Вопрос 8
                new QuizAnswerOption { Id = 69, Text = "Архитектура", IsCorrect = true, QuizQuestionId = 18 },
                new QuizAnswerOption { Id = 70, Text = "Живопись", IsCorrect = false, QuizQuestionId = 18 },
                new QuizAnswerOption { Id = 71, Text = "Музыка", IsCorrect = false, QuizQuestionId = 18 },
                new QuizAnswerOption { Id = 72, Text = "Скульптура", IsCorrect = false, QuizQuestionId = 18 },

                // Вопрос 9
                new QuizAnswerOption { Id = 73, Text = "Монархия", IsCorrect = false, QuizQuestionId = 19 },
                new QuizAnswerOption { Id = 74, Text = "Республика", IsCorrect = true, QuizQuestionId = 19 },
                new QuizAnswerOption { Id = 75, Text = "Демократия", IsCorrect = false, QuizQuestionId = 19 },
                new QuizAnswerOption { Id = 76, Text = "Олигархия", IsCorrect = false, QuizQuestionId = 19 },

                // Вопрос 10
                new QuizAnswerOption { Id = 77, Text = "V веке до н.э.", IsCorrect = false, QuizQuestionId = 20 },
                new QuizAnswerOption { Id = 78, Text = "IV веке н.э.", IsCorrect = true, QuizQuestionId = 20 },
                new QuizAnswerOption { Id = 79, Text = "III веке до н.э.", IsCorrect = false, QuizQuestionId = 20 },
                new QuizAnswerOption { Id = 80, Text = "I веке до н.э.", IsCorrect = false, QuizQuestionId = 20 }
                
            // Вопрос 22
                new QuizAnswerOption { Id = 85, Text = "GitHub", IsCorrect = true, QuizQuestionId = 22 },
                new QuizAnswerOption { Id = 86, Text = "Docker", IsCorrect = false, QuizQuestionId = 22 },
                new QuizAnswerOption { Id = 87, Text = "Google Drive", IsCorrect = false, QuizQuestionId = 22 },
                new QuizAnswerOption { Id = 88, Text = "Slack", IsCorrect = false, QuizQuestionId = 22 },

                // Вопрос 23
                new QuizAnswerOption { Id = 89, Text = "Apple", IsCorrect = true, QuizQuestionId = 23 },
                new QuizAnswerOption { Id = 90, Text = "Microsoft", IsCorrect = false, QuizQuestionId = 23 },
                new QuizAnswerOption { Id = 91, Text = "Google", IsCorrect = false, QuizQuestionId = 23 },
                new QuizAnswerOption { Id = 92, Text = "Amazon", IsCorrect = false, QuizQuestionId = 23 },

                // Вопрос 24
                new QuizAnswerOption { Id = 93, Text = "JavaScript", IsCorrect = false, QuizQuestionId = 24 },
                new QuizAnswerOption { Id = 94, Text = "Python", IsCorrect = false, QuizQuestionId = 24 },
                new QuizAnswerOption { Id = 95, Text = "PHP", IsCorrect = true, QuizQuestionId = 24 },
                new QuizAnswerOption { Id = 96, Text = "C++", IsCorrect = false, QuizQuestionId = 24 },

                // Вопрос 25
                new QuizAnswerOption { Id = 97, Text = "MySQL", IsCorrect = false, QuizQuestionId = 25 },
                new QuizAnswerOption { Id = 98, Text = "SQLite", IsCorrect = false, QuizQuestionId = 25 },
                new QuizAnswerOption { Id = 99, Text = "Hadoop", IsCorrect = true, QuizQuestionId = 25 },
                new QuizAnswerOption { Id = 100, Text = "Redis", IsCorrect = false, QuizQuestionId = 25 },

                // Вопрос 26
                new QuizAnswerOption { Id = 101, Text = "TCP", IsCorrect = false, QuizQuestionId = 26 },
                new QuizAnswerOption { Id = 102, Text = "UDP", IsCorrect = false, QuizQuestionId = 26 },
                new QuizAnswerOption { Id = 103, Text = "TLS", IsCorrect = true, QuizQuestionId = 26 },
                new QuizAnswerOption { Id = 104, Text = "FTP", IsCorrect = false, QuizQuestionId = 26 },

                // Вопрос 27
                new QuizAnswerOption { Id = 105, Text = "Angular", IsCorrect = false, QuizQuestionId = 27 },
                new QuizAnswerOption { Id = 106, Text = "Vue", IsCorrect = false, QuizQuestionId = 27 },
                new QuizAnswerOption { Id = 107, Text = "React", IsCorrect = true, QuizQuestionId = 27 },
                new QuizAnswerOption { Id = 108, Text = "Svelte", IsCorrect = false, QuizQuestionId = 27 },

                // Вопрос 28
                new QuizAnswerOption { Id = 109, Text = "Ruby", IsCorrect = false, QuizQuestionId = 28 },
                new QuizAnswerOption { Id = 110, Text = "JavaScript", IsCorrect = false, QuizQuestionId = 28 },
                new QuizAnswerOption { Id = 111, Text = "Python", IsCorrect = true, QuizQuestionId = 28 },
                new QuizAnswerOption { Id = 112, Text = "Go", IsCorrect = false, QuizQuestionId = 28 },

                // Вопрос 29
                new QuizAnswerOption { Id = 113, Text = "Vim", IsCorrect = true, QuizQuestionId = 29 },
                new QuizAnswerOption { Id = 114, Text = "Notepad", IsCorrect = false, QuizQuestionId = 29 },
                new QuizAnswerOption { Id = 115, Text = "Paint", IsCorrect = false, QuizQuestionId = 29 },
                new QuizAnswerOption { Id = 116, Text = "MS Word", IsCorrect = false, QuizQuestionId = 29 },

                // Вопрос 30
                new QuizAnswerOption { Id = 117, Text = "XML", IsCorrect = false, QuizQuestionId = 30 },
                new QuizAnswerOption { Id = 118, Text = "JSON", IsCorrect = true, QuizQuestionId = 30 },
                new QuizAnswerOption { Id = 119, Text = "HTML", IsCorrect = false, QuizQuestionId = 30 },
                new QuizAnswerOption { Id = 120, Text = "CSV", IsCorrect = false, QuizQuestionId = 30 }
            };

            modelBuilder.Entity<QuizAnswerOption>().HasData(answerOptions);
        }
    }
}
