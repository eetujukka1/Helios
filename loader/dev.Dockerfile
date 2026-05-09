FROM node:24

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
COPY shared/package.json ./shared/
COPY loader/package.json ./loader/
COPY queue/package.json ./queue/

RUN npm install

WORKDIR /usr/src/app/loader
CMD ["sh", "-c", "npm run dev"]
