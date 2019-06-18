FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY fake_htpasswd /etc/nginx/htpasswd
COPY ssl/dhparam.pem /etc/nginx/ssl/dhparam.pem
COPY ssl/nginx.crt /etc/nginx/ssl/nginx.crt
COPY ssl/nginx.key /etc/nginx/ssl/nginx.key

ARG icc
ARG security-opt