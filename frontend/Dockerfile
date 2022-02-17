FROM node:15-alpine

WORKDIR /frontend
COPY . /frontend

RUN npm i;

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]