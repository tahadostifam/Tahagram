FROM node:14

WORKDIR /server
COPY . /server

RUN npm i;

EXPOSE 8000
EXPOSE 2345

CMD [ "npm", "start" ]