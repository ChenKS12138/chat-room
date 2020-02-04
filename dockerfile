FROM node:lts-buster
MAINTAINER ChenKS

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN  useradd -ms /bin/bash chat_room \
  && chown chat_room:chat_room -R /usr/src/app \
  && npm config set registry https://registry.npm.taobao.org \
  && npm install -g pm2 \ 
  && npm install 

USER chat_room

EXPOSE 3000


CMD ["pm2-docker","start","app.js"]