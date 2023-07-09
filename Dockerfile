FROM docker.io/node:18-alpine AS builder
COPY . /app-back
WORKDIR /app-back
RUN yarn install

EXPOSE 8000
ENV MONGO_URL=mongodb+srv://Truc:azerty@testcluster.uzxy0.mongodb.net/my_app?retryWrites=true&w=majority
ENV API_PORT=8000
ENV TOKEN_KEY=lespangolinssontuneespeceenvoitdextinction

CMD ["node", "index.js"]