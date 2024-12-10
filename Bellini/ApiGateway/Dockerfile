# Этот этап используется при запуске из VS в быстром режиме (по умолчанию для конфигурации отладки)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081 

# Этот этап используется для сборки проекта службы
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["ApiGateway/ApiGateway.csproj", "ApiGateway/"]
COPY ["BusinessLogicLayer/BusinessLogicLayer.csproj", "BusinessLogicLayer/"]
COPY ["DataAccessLayer/DataAccessLayer.csproj", "DataAccessLayer/"]
COPY ["UtilsModelsLibrary/UtilsModelsLibrary.csproj", "UtilsModelsLibrary/"]
COPY ["EmailSenderLibrary/EmailSenderLibrary.csproj", "EmailSenderLibrary/"]
RUN dotnet restore "./ApiGateway/ApiGateway.csproj"
COPY . . 
WORKDIR "/src/ApiGateway"
RUN dotnet build "./ApiGateway.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Этот этап используется для публикации проекта службы, который будет скопирован на последний этап
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./ApiGateway.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Этот этап используется в рабочей среде или при запуске из VS в обычном режиме (по умолчанию, когда конфигурация отладки не используется)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Создаем папку для сертификатов и копируем сертификат из конкретного каталога
RUN mkdir -p /app/certificates
COPY ApiGateway/ocelot.docker.json /app
COPY ApiGateway/certificates/* /app/certificates

USER root

RUN cp /app/certificates/ca.crt /usr/local/share/ca-certificates/ca.crt && update-ca-certificates

ENTRYPOINT ["dotnet", "ApiGateway.dll"]
