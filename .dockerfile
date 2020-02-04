FROM node:lts-buster
MAINTAINER ChenKS

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN  useradd -ms /bin/bash chat_room \
  && chown website_watcher:website_watcher -R /usr/src/app \
  && npm config set registry https://registry.npm.taobao.org \
  && npm install -g pm2 \ 
  && npm install 

USER chat_root

EXPOSE 3000


CMD ["pm2-docker","start","app.js"]