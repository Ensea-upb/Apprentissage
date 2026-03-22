FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend/ .
COPY packages/ /packages/
RUN npx prisma generate
RUN npx tsc --skipLibCheck

EXPOSE 3001

CMD ["sh", "-c", "npx prisma db push && node dist/index.js"]
