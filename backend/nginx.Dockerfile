FROM nginx

WORKDIR /app
COPY . .
RUN rm -f /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 5000