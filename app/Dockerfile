FROM node:10-alpine

ARG icc
ARG security-opt

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN apk add --no-cache --virtual .gyp \
    autoconf \
    automake \
    g++ \
    libpng-dev \
    libtool \
    make \
    nasm \
    python \
    git \
  && npm i \
  && npm cache clean --force \
  && npm rebuild bcrypt --build-from-source \
  && apk del .gyp
COPY . /usr/src/app

EXPOSE 8585
CMD [ "npm", "start" ]
