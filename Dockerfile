FROM node:9.11.1

ADD package.json /app/

WORKDIR /app

RUN npm install --registry=https://registry.npm.taobao.org

ADD . /app

CMD ["npm", "start"]