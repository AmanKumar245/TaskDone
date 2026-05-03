FROM node:20-alpine

WORKDIR /app

# Copy dependency files first for better layer caching
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy application source
COPY . .

EXPOSE 5000

CMD ["node", "index.js"]
