# Use the official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./



# Install dependencie --legacy-peer-deps as mismatch of dependency versions
RUN npm i --legacy-peer-deps


# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

#Delete dependency that are not needed in production
RUN npm prune --production

# Expose the port the app runs on
EXPOSE 5000

# Define environment variable
ENV NODE_ENV=production

# Command to run the application
CMD ["npm", "start"]










