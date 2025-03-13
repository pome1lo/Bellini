using System;
using System.ComponentModel;
using System.Reflection;

namespace UtilsModelsLibrary.Base
{
    public static class EnumBase
    {
        public static string GetDescription<T>(this T enumValue) where T : Enum
        {
            FieldInfo? field = enumValue.GetType().GetField(enumValue.ToString());
            if (field == null) return enumValue.ToString();

            var attribute = field.GetCustomAttribute<DescriptionAttribute>();

            return attribute?.Description ?? enumValue.ToString();
        }
    }
}
