FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Thêm dòng này để gán trực tiếp URL Backend khi build Vite
ENV VITE_API_URL=https://mern-backend-237561.onrender.com

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
