#Create docker
FROM mcr.microsoft.com/playwright:v1.35.0-jammy

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# Copy your app files to the container
COPY ./src  ./src

# Install dependencies
RUN npm install

# Build app
#Expose port if you have any.
EXPOSE 3000
CMD [ "npm", "start" ]
