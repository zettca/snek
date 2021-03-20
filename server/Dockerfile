FROM node:lts-alpine

WORKDIR /snek

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build
RUN npm prune --production 

EXPOSE 8080

CMD [ "npm", "start" ]
