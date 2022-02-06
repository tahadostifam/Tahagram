FROM node:14

WORKDIR /app
COPY . /app

RUN npm i;

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]