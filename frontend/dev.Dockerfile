FROM node:24

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/
COPY shared/package.json ./shared/

RUN npm install

WORKDIR /usr/src/app/frontend
CMD ["npm", "run", "dev", "--", "--host"]
