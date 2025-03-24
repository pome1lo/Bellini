# ���� 1: ������ ����������
FROM node:18 AS builder

WORKDIR /app
 
COPY package*.json ./ 
RUN npm install
RUN npm install aos --save
COPY . . 
RUN rm -f .env


RUN npm run build
 
FROM nginx:alpine 
COPY --from=builder /app/dist /usr/share/nginx/html 
COPY /certs/local/LAB.crt /etc/nginx/certs/LAB.crt
COPY /certs/local/LAB.key /etc/nginx/certs/LAB.key
COPY nginx.conf /etc/nginx/conf.d/default.conf
 
EXPOSE 443

#RUN ls -l ./certs/ca

#COPY ../certs/ca/ca.crt /etc/nginx/certs/ca.crt
#COPY ../certs/ca/ca.key /etc/nginx/certs/ca.key


# ��������� nginx%
CMD ["nginx", "-g", "daemon off;"]
