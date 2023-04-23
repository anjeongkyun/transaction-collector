# Common build stage
FROM node:18.12.1-slim

COPY . ./app

WORKDIR /app

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]

