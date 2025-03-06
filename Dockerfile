# Use the official Node.js image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Install pm2 globally
RUN npm install pm2 -g

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port the app will run on
EXPOSE 5000

# Start the app using pm2-runtime for better management in Docker
CMD ["pm2-runtime", "index.js"]
