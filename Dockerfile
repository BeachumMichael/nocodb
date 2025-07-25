FROM node:20-slim

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy project
COPY . .

# Install and build everything
RUN pnpm install && pnpm run build

# Expose frontend/backend
EXPOSE 3000 8080

# Start backend in production mode
CMD ["pnpm", "run", "start:prod"]
