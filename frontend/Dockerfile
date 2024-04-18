FROM node:18-alpine

WORKDIR /react-docker/

COPY public/ /react-docker/public
RUN pwd
COPY src/ /react-docker/src
RUN pwd
COPY package.json /react-docker/
COPY tsconfig.json /react-docker/

RUN npm install

CMD npm start --host 0.0.0.0 --port 4000 --disableHostCheck true
