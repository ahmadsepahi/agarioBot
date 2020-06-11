FROM node:latest

WORKDIR /usr/src/app

RUN apt-get update -y
RUN apt-get install python3 -y
RUN apt-get install --yes python3-pip
RUN apt-get install bash -y

RUN pip3 install socketIO-client
RUN pip3 install agario-bot

COPY package*.json ./
COPY npm-shrinkwrap.json ./

RUN npm install

COPY . .

ENTRYPOINT ["npm","start"]

#Don't change this port unless you change the bot default port
EXPOSE 3000