# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port that the service listens on (in this case, 3001)
EXPOSE 4000

# Define the command to run the Node.js service when the container starts
CMD [ "npm", "start" ]
