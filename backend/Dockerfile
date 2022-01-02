FROM ruby:3.0.3

WORKDIR /app
COPY . .

RUN bundle;

EXPOSE 2345
EXPOSE 2346

CMD [ "ruby", "src/server.rb" ]