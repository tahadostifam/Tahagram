FROM node:15-alpine

WORKDIR /server

COPY . .

RUN npm install

RUN npm run build

RUN cp -r ./configs ./build

EXPOSE 8000
EXPOSE 2345

CMD [ "npm", "start" ]