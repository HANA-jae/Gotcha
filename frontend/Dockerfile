FROM node:18-alpine AS builder

WORKDIR /build

COPY package*.json .
RUN npm install

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /build/build ./build
COPY --from=builder /build/package*.json .
RUN npm install --only=production && npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
