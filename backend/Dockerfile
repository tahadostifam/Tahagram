FROM ruby:3.0.3

RUN apt update; apt install nano postgresql-client libpq5 libpq-dev -y
WORKDIR /app
COPY . .

RUN bundle;

EXPOSE 2345
EXPOSE 2346

CMD [ "ruby", "src/server.rb" ]