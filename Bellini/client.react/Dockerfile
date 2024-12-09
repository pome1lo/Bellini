# Этап 1: Сборка приложения
FROM node:18 AS builder

WORKDIR /app

# Скопируем только package.json и package-lock.json
COPY package*.json ./

# Установим зависимости
RUN npm install

# Скопируем все файлы проекта
COPY . .

# Соберем проект
RUN npm run build

# Этап 2: Сервер nginx для статических файлов
FROM nginx:alpine

# Копируем билд в nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем конфиг nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт
EXPOSE 80

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]
