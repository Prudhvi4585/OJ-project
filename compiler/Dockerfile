# Use Node.js base image
FROM node:18-slim

# Set working directory inside the container
WORKDIR /app

RUN apt-get update && apt-get install -y g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files into the container
COPY . .

# Expose the port (your compiler probably runs on 5000)
EXPOSE 5000

# Start the compiler service
CMD ["node", "index.js"]