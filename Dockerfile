FROM docker.io/node:18-alpine AS builder
COPY . /app-back
WORKDIR /app-back
RUN yarn install

EXPOSE 8000

CMD ["node", "index.js"]