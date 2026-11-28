FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --quiet

# Source is baked in; `docker compose up --watch` syncs later edits into the container.
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]
