FROM node:18 AS builder

WORKDIR /app

COPY package*.json tsconfig.json ./
COPY prisma ./prisma/

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait

RUN npm install

RUN npx prisma generate

COPY src ./src
COPY test ./test 

RUN npm run build

FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY prisma ./prisma/

RUN npx prisma generate

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /wait /wait

EXPOSE 3000

CMD ["sh", "-c", "/wait && npx prisma migrate deploy && npm run start"]
