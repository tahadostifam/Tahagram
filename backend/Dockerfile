FROM ruby:3.0.3

RUN apt-get update; apt-get install git vim neofetch -y;

WORKDIR /app
COPY . .

RUN bundle;

EXPOSE 2345

CMD [ "ruby", "src/server.rb -p 2345" ]