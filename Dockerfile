# Use official Node.js 19 image
FROM node:19-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first for caching
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the app
COPY . .

# Expose the web server port
EXPOSE 3000

# Start the bot
CMD ["node", "index.js"]
