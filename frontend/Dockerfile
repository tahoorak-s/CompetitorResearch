FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npx", "next", "dev", "-H", "0.0.0.0", "-p", "3000"]
