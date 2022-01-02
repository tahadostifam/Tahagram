FROM nginx

RUN apt-get update; apt-get install net-tools nano -y;
RUN rm -f /etc/nginx/nginx.conf
COPY ./nginx.conf /etc/nginx/nginx.conf
EXPOSE 8000