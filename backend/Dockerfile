FROM node

WORKDIR /app
COPY . .

RUN bundle;

EXPOSE 8000
EXPOSE 2345

CMD [ "npm", "start" ]