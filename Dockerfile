FROM node:12

# Create service directory
WORKDIR /usr/src/service

# Copy service code into service directory
COPY . .

# Install dependencies
RUN npm install

# Launch de service
CMD node index.js