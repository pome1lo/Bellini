using System.ComponentModel;

namespace UtilsModelsLibrary.Enums
{
 public enum AchievementType
    {
        [Description("Первое редактирование профиля")]
        FirstProfileEdit = 1,

        [Description("Установка первого аватара")]
        FirstAvatarSet,

        [Description("Первый завершенный квиз")]
        FirstQuizCompleted,

        [Description("Первое участие в игре")]
        FirstGamePlayed,

        [Description("10 завершенных квизов")]
        TenQuizzesCompleted,

        [Description("10 сыгранных игр")]
        TenGamesPlayed,

        [Description("25 завершенных квизов")]
        TwentyFiveQuizzesCompleted,

        [Description("25 сыгранных игр")]
        TwentyFiveGamesPlayed,

        [Description("Первый комментарий к игре")]
        FirstGameComment,

        [Description("Первая игра")]
        FirstGameCreated,

        [Description("Первый комментарий к квизу")]
        FirstQuizComment,

        [Description("Первый созданный квиз")]
        FirstQuizCreated,

        [Description("Первый созданный вопрос")]
        FirstQuestionCreated
    }
}
