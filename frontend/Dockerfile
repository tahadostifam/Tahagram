FROM node:14

WORKDIR /frontend
COPY . /frontend

RUN npm i;

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]