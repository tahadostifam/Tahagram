FROM node:14

WORKDIR /server

COPY . .

RUN npm install

RUN npm run build

EXPOSE 8000
EXPOSE 2345

CMD [ "npm", "start" ]