FROM ruby:3.0.3

RUN apt-get update; apt-get install npm -y;
RUN npm i -g nodemon;

WORKDIR /app
COPY . .

RUN bundle;

EXPOSE 2345
EXPOSE 2346

CMD [ "nodemon", "src/server.rb" ]