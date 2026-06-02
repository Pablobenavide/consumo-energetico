FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev || npm install

COPY src ./src
COPY jest.config.js ./jest.config.js
COPY eslint.config.mjs ./eslint.config.mjs
COPY tests ./tests

EXPOSE 4000

CMD ["node", "src/server.js"]