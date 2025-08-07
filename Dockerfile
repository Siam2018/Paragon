# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install backend dependencies
RUN cd backend && npm install --production

# Copy backend source code
COPY backend/ ./backend/

# Create uploads directory with proper permissions
RUN mkdir -p /app/backend/uploads && \
    mkdir -p /app/backend/uploads/courses && \
    mkdir -p /app/backend/uploads/gallery && \
    mkdir -p /app/backend/uploads/notices && \
    mkdir -p /app/backend/uploads/Publications && \
    mkdir -p /app/backend/uploads/Results && \
    mkdir -p /app/backend/uploads/students && \
    chmod -R 755 /app/backend/uploads

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
