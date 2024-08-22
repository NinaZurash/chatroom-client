FROM node:18

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

ENV NODE_ENV production
ENV BACKEND_API_URL=http://localhost:8080

EXPOSE 3000

CMD ["npm", "start"]
