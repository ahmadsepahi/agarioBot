FROM node:8.9.4

ENV APP_HOME /agario

RUN mkdir -p ${APP_HOME}
WORKDIR ${APP_HOME}

ADD package*.json ${APP_HOME}
RUN npm install

ADD . ${APP_HOME}