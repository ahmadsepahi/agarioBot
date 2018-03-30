FROM node:8.9.4

ENV APP_HOME /agario

RUN mkdir $APP_HOME
WORKDIR $APP_HOME
ADD . /agario

RUN npm install