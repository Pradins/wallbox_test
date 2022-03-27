FROM node:16

WORKDIR /usr/src/app

COPY /package.json ./
COPY /tsconfig.json ./

RUN npm install

COPY /server ./server

EXPOSE 3100 3200

CMD ["npm", "run", "start:server"]

# docker build . -t wallbox/server
# docker run -p 3100:3100 -p 3200:3200 -d wallbox/server
