# Combined Dockerfile for deploying backend
# Build from the root directory

FROM node:20-alpine

WORKDIR /app

# Copy backend files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy backend source code
COPY backend/ .

# Create uploads directories
RUN mkdir -p uploads/hero uploads/dates uploads/honey uploads/oud uploads/spices uploads/general

# Expose port
EXPOSE 4000

ENV NODE_ENV=production
ENV PORT=4000

# Start the application
CMD ["node", "server.js"]
